_G.Object = function(t)
    if type(t) ~= "table" or true then
        return t
    end

    local o = TypeWriter.JavaScript:New(TypeWriter.JavaScript.Global.Object)
    for k, v in pairs(t) do
        assert(type(k) == "string" or js.typeof(k) == "symbol", "JavaScript only has string and symbol keys")
        if type(v) == "table" then
            v = ToJs(v)
        end
        o[k] = v
    end
    return o
end

_G.Array = function(t)
    if type(t) ~= "table" or true then
        return t
    end

    local a = TypeWriter.JavaScript:New(TypeWriter.JavaScript.Global.Array)
    for i, v in ipairs(t) do
        if type(v) == "table" then
            v = ToJs(v)
        end
        a[i - 1] = v
    end
    return a
end

_G.ToJs = function(o)
    if type(o) ~= "table" then
        return o
    end

    local FirstKey

    for K, _ in pairs(o) do
        FirstKey = K
        break
    end

    if (type(FirstKey) == "number") then
        return Array(o)
    else
        return Object(o)
    end
end

_G.ToLua = function(o)
    if type(o) ~= "userdata" then
        return o
    elseif type(o) == "table" then
        for Key, Value in pairs(o) do
            ToLua(Value)
        end
    end

    if TypeWriter.JavaScript.Global:Object(o) == "object" then
        local t = {}
        for k, v in pairs(o) do
            t[k] = ToLua(v)
        end
        return t
    elseif TypeWriter.JavaScript.Global:Object(o) == "array" then
        local t = {}
        for i = 0, o.length - 1 do
            t[i + 1] = ToLua(o[i])
        end
        return t
    else
        return o
    end
end

local FS = TypeWriter.JavaScript:Require("fs-extra")
local Base64 = TypeWriter.JavaScript:Require("js-base64")
local Json = TypeWriter.JavaScript.Global.JSON

_G.Inspect = function(O)
    return TypeWriter.JavaScript.Global.console:log(O)
end
_G.CoreLauncher = {}
TypeWriter.JavaScript.Global.CoreLauncher = _G.CoreLauncher
CoreLauncher.DevMode = TypeWriter.JavaScript.Global.process.env.CORELAUNCHER_DEV == "true"
CoreLauncher.ApplicationData = TypeWriter.ApplicationData .. "/CoreLauncher/"
CoreLauncher.PluginsFolder = CoreLauncher.ApplicationData .. "/Plugins/"
FS:ensureDirSync(CoreLauncher.ApplicationData)
FS:ensureDirSync(CoreLauncher.PluginsFolder)

CoreLauncher.AccountManager = TypeWriter.JavaScript.New(Import("ga.corelauncher.Classes.AccountManager"))
CoreLauncher.DataBase = TypeWriter.JavaScript.New(Import("ga.corelauncher.DataBase"), CoreLauncher.ApplicationData .. "/Database.json")
CoreLauncher.PluginManager = TypeWriter.JavaScript.New(Import("ga.corelauncher.Classes.PluginManager"))
CoreLauncher.GameManager = TypeWriter.JavaScript.New(Import("ga.corelauncher.Classes.GameManager"))
CoreLauncher.WindowControl = TypeWriter.JavaScript.New(Import("ga.corelauncher.Classes.WindowControl"))

CoreLauncher.Electron = Import("electronhelper")()
CoreLauncher.ElectronApplication = CoreLauncher.Electron.app
CoreLauncher.ElectronApplication.whenReady():await()

CoreLauncher.IPCMain = CoreLauncher.Electron.ipcMain
CoreLauncher.BrowserWindow = TypeWriter.JavaScript.New(
    CoreLauncher.Electron.BrowserWindow,
    {
        show = false,
        frame = false,
        center = true,
        titleBarStyle = "hidden",

        width = 275,
        height = 400,
        minWidth = 1000,
        minHeight = 600,

        webPreferences = {
            preload = TypeWriter.ResourceManager:GetFilePath("CoreLauncher", "/Frontend/preload.js")
        }
    }
)
CoreLauncher.BrowserWindow.setResizable(false)

Import("ga.corelauncher.ipc.pipes.accountmanager")
Import("ga.corelauncher.ipc.pipes.database")
Import("ga.corelauncher.ipc.pipes.gamemanager")
Import("ga.corelauncher.ipc.pipes.pluginmanager")
Import("ga.corelauncher.ipc.pipes.windowcontrol")

CoreLauncher.StaticServer = Import("me.corebyte.static")(
    9875,
    "CoreLauncher",
    "Frontend",
    nil,
    function(_, Request, Response)
        if Request.path ~= "/AccountCallback.txt" then return end
        if Request.query == nil then return end
        local Data = Json:parse(
            Base64:decode(Request.query.d)
        )
        CoreLauncher.AccountManager:FinishedConnection(Data.Type, Data.Data)
        CoreLauncher.BrowserWindow:restore()
    end
)

if CoreLauncher.DevMode then
    TypeWriter.Logger:Warning("We are running in dev env")
    CoreLauncher.BrowserWindow.loadURL("http://localhost:9874")
    CoreLauncher.BrowserWindow.openDevTools()
else
    CoreLauncher.BrowserWindow.loadURL("http://localhost:9875")
end

CoreLauncher.PluginManager:LoadPlugins(CoreLauncher.PluginsFolder)
CoreLauncher.GameManager:LoadGames(CoreLauncher.PluginManager:ListGames())
CoreLauncher.AccountManager:LoadAccountTypes(CoreLauncher.PluginManager:ListAccountTypes())

CoreLauncher.BrowserWindow.once(
    "ready-to-show",
    function()
        CoreLauncher.BrowserWindow.show()

        CoreLauncher.BrowserWindow.setResizable(true)
        CoreLauncher.BrowserWindow.setSize(1000, 600)
        CoreLauncher.BrowserWindow.center()
    end
)

CoreLauncher.BrowserWindow.on(
    "resize",
    function()
        local Size = CoreLauncher.BrowserWindow.getSize()
        CoreLauncher.DataBase:SetKey("Window.Width", Size[0])
        CoreLauncher.DataBase:SetKey("Window.Height", Size[1])
    end
)

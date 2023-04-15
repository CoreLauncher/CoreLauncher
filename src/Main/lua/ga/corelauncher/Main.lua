Import("ga.corelauncher.LoadLibraries")()

_G.Object = function (t)
	local o = js.new(js.global.Object)
	for k, v in pairs(t) do
		assert(type(k) == "string" or js.typeof(k) == "symbol", "JavaScript only has string and symbol keys")
		o[k] = v
	end
	return o
end

local FS = TypeWriter:JsRequire("fs-extra")


_G.Inspect = function (O)
    print(Import("ga.corelauncher.Helpers.inspect")(O))
end
_G.CoreLauncher = {}
js.global.CoreLauncher = _G.CoreLauncher
CoreLauncher.DevMode = js.global.process.env.CORELAUNCHER_DEV == "true"
CoreLauncher.ApplicationData = TypeWriter.ApplicationData .. "/CoreLauncher/"
CoreLauncher.PluginsFolder = CoreLauncher.ApplicationData .. "/Plugins/"
FS:ensureDirSync(CoreLauncher.ApplicationData)
FS:ensureDirSync(CoreLauncher.PluginsFolder)

CoreLauncher.DataBase = js.new(Import("ga.corelauncher.DataBase"), CoreLauncher.ApplicationData .. "/Database.json")
CoreLauncher.PluginManager = Import("ga.corelauncher.Helpers.PluginManager")
CoreLauncher.GameManager = Import("ga.corelauncher.Helpers.GameManager")

CoreLauncher.Electron = Import("electronhelper")
CoreLauncher.ElectronApplication = CoreLauncher.Electron.app
Await(CoreLauncher.ElectronApplication:whenReady())

CoreLauncher.IPCMain = CoreLauncher.Electron.ipcMain
CoreLauncher.BrowserWindow = jsnew(
    CoreLauncher.Electron.BrowserWindow,
    Object(
        {
            show = false,
            frame = false,
            center = true,
            resizable = false,
            titleBarStyle = "hidden",

            width = 275,
            height = 400,
            maxWidth = 1000,
            maxHeight = 600,

            webPreferences = Object(
                {
                    preload = TypeWriter.ResourceManager:GetFilePath("CoreLauncher", "/Frontend/preload.js")
                }
            )
        }
    )
)

Import("ga.corelauncher.ipc.pipes.gamemanager")

if CoreLauncher.DevMode then
    TypeWriter.Logger:Warning("We are running in dev env")
    TypeWriter.Logger:Warning("Skipping webserver")
    CoreLauncher.BrowserWindow:loadURL("http://localhost:9874")
    CoreLauncher.BrowserWindow:openDevTools()
else
    CoreLauncher.StaticServer = Import("me.corebyte.static")("", 9875, "CoreLauncher", "Frontend")
    CoreLauncher.BrowserWindow:loadURL("http://localhost:9875")
end

CoreLauncher.BrowserWindow:on(
    "ready-to-show",
    function()
        CoreLauncher.BrowserWindow:show()

        CoreLauncher.PluginManager:LoadPlugins(CoreLauncher.PluginsFolder)

        CoreLauncher.BrowserWindow:setResizable(true)
        CoreLauncher.BrowserWindow:setSize(1000, 600)
        CoreLauncher.BrowserWindow:center()
    end
)

CoreLauncher.BrowserWindow:on("resize", function()
    local Size = CoreLauncher.BrowserWindow:getSize()
    CoreLauncher.DataBase:SetKey("Window.Width", Size[0])
    CoreLauncher.DataBase:SetKey("Window.Height", Size[1])
end)


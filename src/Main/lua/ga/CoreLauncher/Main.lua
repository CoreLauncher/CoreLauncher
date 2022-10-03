print("Hello World!")
--Imports
local FS = require("fs")



--Globals
local Resources = TypeWriter.LoadedPackages["CoreLauncher"].Resources
TypeWriter.Runtime.LoadJson(Resources["/Libraries/Discord-RPC.twr"])
TypeWriter.Runtime.LoadJson(Resources["/Libraries/Electron-Lua-Bootstrap.twr"])
TypeWriter.Runtime.LoadJson(Resources["/Libraries/IPC-Bootstrap.twr"])
TypeWriter.Runtime.LoadJson(Resources["/Libraries/Static.twr"])

_G.CoreLauncher = {}
CoreLauncher.Electron = Import("Electron.bootstrap").LoadAll()
CoreLauncher.RPC = Import("ga.CoreLauncher.RPC"):new("1008708322922352753")
CoreLauncher.IPC = Import("openipc.connector"):new("CoreLauncher", "Main")
CoreLauncher.ApplicationData = TypeWriter.ApplicationData .. "/CoreLauncher/"
CoreLauncher.Dev = process.env.CORELAUNCHER_DEV == "true"
CoreLauncher.Http = Import("ga.CoreLauncher.Libraries.Http")
CoreLauncher.Games = Import("ga.CoreLauncher.Games")
CoreLauncher.Config = Import("ga.CoreLauncher.Libraries.Config"):new(CoreLauncher.ApplicationData .. "/Data.json")
CoreLauncher.Accounts = Import("ga.CoreLauncher.Libraries.Accounts"):new()
CoreLauncher.ProgressBar = Import("ga.CoreLauncher.Libraries.ProgressBar"):new()
CoreLauncher.Game = {
    IsRunning = false,
    RunningId = ""
}

--Setup config
do
    local Config = CoreLauncher.Config
    Config:SetKeyIfNotExists("Games", {})
    Config:SetKeyIfNotExists("Settings", {})
    Config:SetKeyIfNotExists("Accounts", {})
end

--Installs
Import("ga.CoreLauncher.Install.FavIcon")()
Import("ga.CoreLauncher.Install.DataFolder")()

--Check Accounts
do
    CoreLauncher.Accounts:RefreshAll()
end

--Load Modules
Import("ga.CoreLauncher.Modules")

--Set RPC
CoreLauncher.RPC:SetActivity(
    {
        state = "https://corelauncher.ga",
        details = "Launcing games",
        largeImageKey = "favicon",
        largeImageText = "CoreLauncher",
        smallImageKey = "cubicinc",
        smallImageText = "Developed by Cubic Inc",
        buttons = {
            {
                label = "Website",
                url = "https://corelauncher.ga"
            },
            {
                label = "Download",
                url = "https://corelauncher.ga/download"
            }
        }
    }
)

--Window settings
CoreLauncher.Window = CoreLauncher.Electron.BrowserWindow(
    {
        icon = CoreLauncher.ApplicationData .. "/favicon.ico",
        title = "CoreLauncher",
        show = false,

        minWidth = 1210,
        minHeight = 800,
    }
)
do
    local Window = CoreLauncher.Window
    Window:on("closed", function()
        TypeWriter.Logger.Info("Closing")
        CoreLauncher.Electron.Close()
        CoreLauncher.IPC:Disconnect()
        CoreLauncher.RPC:Disconnect()
    end)
    local Show = false
    Window:Once(
        "ready-to-show",
        function ()
            Show = true
        end
    )
    if CoreLauncher.Dev then
        Window:OpenDevTools()
    else
        Window:RemoveMenu()
        -- Load static server

    end
    Window:LoadURL("http://localhost:9874")
    Window:Show()

    if Show == false then
        Window:WaitFor("ready-to-show")
    end
    Window:Show()
end

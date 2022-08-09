print("Hello World!")
--Imports
local FS = require("fs")

--Globals
local ApplicationDataFolder = TypeWriter.ApplicationData .. "\\CoreLauncher/"
TypeWriter.Runtime.LoadFile(ApplicationDataFolder .. "/Electron-Lua-Bootstrap.twr")
TypeWriter.Runtime.LoadFile(ApplicationDataFolder .. "/IPC-Bootstrap.twr")
_G.CoreLauncher = {
    Electron = Import("Electron.bootstrap").LoadAll(),
    IPC = Import("openipc.connector"):new("CoreLauncher", "Main"),
    ApplicationData = ApplicationDataFolder,
    Dev = process.env.CORELAUNCHER_DEV == "true",
    Games = Import("ga.CoreLauncher.Games")
}

--Installing
Import("ga.CoreLauncher.Install.FavIcon")()

--Load Modules
Import("ga.CoreLauncher.Modules")

--Window settings
CoreLauncher.Window = CoreLauncher.Electron.BrowserWindow(
    {
        icon = CoreLauncher.ApplicationData .. "/favicon.ico",
        title = "CoreLauncher",
        show = false,

        minWidth = 800,
        minHeight = 600,
    }
)
do
    local Window = CoreLauncher.Window
    Window:on("closed", function()
        CoreLauncher.Electron.Close()
        CoreLauncher.IPC:Disconnect()
    end)
    Window:RemoveMenu()
    if CoreLauncher.Dev then
        Window:OpenDevTools()
        Window:LoadURL("http://localhost")
    else
        -- Load static server
    end
    Window:WaitFor("ready-to-show")
    Window:Show()
end

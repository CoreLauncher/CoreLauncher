print("Hello World!")
--Imports
local FS = require("fs")

--Globals
local ApplicationDataFolder = TypeWriter.ApplicationData .. "\\CoreLauncher/"
TypeWriter.Runtime.LoadFile(ApplicationDataFolder .. "/Electron-Lua-Bootstrap.twr")
TypeWriter.Runtime.LoadFile(ApplicationDataFolder .. "/IPC-Bootstrap.twr")
TypeWriter.Runtime.LoadFile(ApplicationDataFolder .. "/Discord-RPC.twr")
_G.CoreLauncher = {}
CoreLauncher.Electron = Import("Electron.bootstrap").LoadAll()
CoreLauncher.RPC = Import("ga.CoreLauncher.RPC"):new("1008708322922352753")
CoreLauncher.IPC = Import("openipc.connector"):new("CoreLauncher", "Main")
CoreLauncher.ApplicationData = ApplicationDataFolder
CoreLauncher.Dev = process.env.CORELAUNCHER_DEV == "true"
CoreLauncher.Games = Import("ga.CoreLauncher.Games")
CoreLauncher.Config = Import("ga.CoreLauncher.Libraries.Config"):new(ApplicationDataFolder .. "/Data.json")
CoreLauncher.Accounts = Import("ga.CoreLauncher.Libraries.Accounts"):new()

--Setup config
do
    local Config = CoreLauncher.Config
    Config:SetKeyIfNotExists("Games", {})
    Config:SetKeyIfNotExists("Settings", {})
    Config:SetKeyIfNotExists("Accounts", {})
end

--Installing
Import("ga.CoreLauncher.Install.FavIcon")()
Import("ga.CoreLauncher.Install.DataFolder")()

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

        minWidth = 800,
        minHeight = 600,
    }
)
do
    local Window = CoreLauncher.Window
    Window:on("closed", function()
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
        Window:LoadURL("http://localhost")
    else
        Window:RemoveMenu()
        -- Load static server
    end
    if Show == false then
        Window:WaitFor("ready-to-show")
    end
    Window:Show()
end

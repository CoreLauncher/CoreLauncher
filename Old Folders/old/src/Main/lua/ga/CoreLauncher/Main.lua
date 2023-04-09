print("Hello World!")
--Imports
local FS = require("fs")
local ApplicationData = TypeWriter.ApplicationData .. "/CoreLauncher/"
FS.mkdirSync(ApplicationData)

--Load Libraries
local Resources = TypeWriter.LoadedPackages["CoreLauncher"].Resources
TypeWriter.Runtime.LoadJson(Resources["/Libraries/Discord-RPC.twr"])
TypeWriter.Runtime.LoadJson(Resources["/Libraries/Electron-Lua-Bootstrap.twr"])
TypeWriter.Runtime.LoadJson(Resources["/Libraries/IPC-Bootstrap.twr"])
TypeWriter.Runtime.LoadJson(Resources["/Libraries/Static.twr"])

--Globals
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
Import("ga.CoreLauncher.Install.ExtractFrontend")()

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
    local StopStatic
    Window:on("closed", function()
        TypeWriter.Logger.Info("Closing")
        CoreLauncher.Electron.Close()
        CoreLauncher.IPC:Disconnect()
        CoreLauncher.RPC:Disconnect()
        if StopStatic then
            StopStatic()
        end
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
        local _, Stop = Import("ga.corebyte.Static")(
            {
                Port = 9874,
                Path = CoreLauncher.ApplicationData .. "/App/"
            }
        )
        StopStatic = Stop
        local Found = false
        while Found == false do
            local Success, Response = pcall(
                function ()
                    local Response = CoreLauncher.Http.Request(
                        "GET",
                        "http://localhost:9874/Ping.txt"
                    )
                    return Response
                end
            )
            if Success and Response.code == 200 then
                Found = true
            end
            Sleep(50)
        end
    end
    Window:LoadURL("http://localhost:9874/")

    if Show == false then
        Window:WaitFor("ready-to-show")
    end
    Window:Show()
end

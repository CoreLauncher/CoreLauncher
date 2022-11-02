print("Hello World!")

--Imports
local FS = require("fs")
local ApplicationData = TypeWriter.ApplicationData .. "/CoreLauncher/"
FS.mkdirSync(ApplicationData)

do
--Load Libraries
local Resources = TypeWriter.LoadedPackages["CoreLauncher"].Resources
TypeWriter.Runtime.LoadJson(Resources["/Libraries/Discord-RPC.twr"])
TypeWriter.Runtime.LoadJson(Resources["/Libraries/Electron-Lua.twr"])
TypeWriter.Runtime.LoadJson(Resources["/Libraries/OpenIPC-TypeWriter.twr"])
TypeWriter.Runtime.LoadJson(Resources["/Libraries/Static.twr"])
end

_G.CoreLauncher = {}
CoreLauncher.IPC = Import("openipc.connector"):new("CoreLauncher", "Main")
CoreLauncher.Electron = Import("Electron")
CoreLauncher.RPC = Import("ga.CoreLauncher.RPC"):new("1008708322922352753")
CoreLauncher.ApplicationData = TypeWriter.ApplicationData .. "/CoreLauncher/"
CoreLauncher.Dev = process.env.CORELAUNCHER_DEV == "true"
CoreLauncher.Http = Import("ga.CoreLauncher.Libraries.Http")
CoreLauncher.Config = Import("ga.CoreLauncher.Libraries.Config"):new(CoreLauncher.ApplicationData .. "/Data2.json")
CoreLauncher.Games = Import("ga.CoreLauncher.Games")
CoreLauncher.API = Import("ga.CoreLauncher.API")

Import("ga.CoreLauncher.Install")
Import("ga.CoreLauncher.Modules")

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

do -- Window
    local WindowState = CoreLauncher.Config:GetKey("WindowState")
    CoreLauncher.Window = CoreLauncher.Electron.BrowserWindow(
        {
            icon = CoreLauncher.ApplicationData .. "/favicon.ico",
            title = "CoreLauncher",
            show = false,

            minWidth = 1000,
            minHeight = 600,
            frame = false,
            fullscreenable = false,
        }
    )

    local Window = CoreLauncher.Window
    if WindowState.Width then
        Window:SetSize(WindowState.Width, WindowState.Height)
        Window:SetPosition(WindowState.X, WindowState.Y)
    end

    local function SaveStateChange()
        local Bounds = Window:getBounds()
        if type(Bounds) ~= "table" then return end
        WindowState.Width = Bounds.width
        WindowState.Height = Bounds.height
        WindowState.X = Bounds.x
        WindowState.Y = Bounds.y
    end
    Window:on("resize", SaveStateChange)
    Window:on("move", SaveStateChange)
    Window:on("maximize", SaveStateChange)
    Window:on("unmaximize", SaveStateChange)

    local StopStatic
    Window:on(
        "closed",
        function()
            TypeWriter.Logger.Info("Closing")
            CoreLauncher.Config:SetKey("WindowState", WindowState)
            CoreLauncher.Electron.Close()
            CoreLauncher.IPC:Disconnect()
            CoreLauncher.RPC:Disconnect()
            if StopStatic then
                StopStatic()
            end
        end
    )
    local Show = false
    Window:Once(
        "ready-to-show",
        function ()
            Show = true
        end
    )
    if CoreLauncher.Dev then
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
    Window:OpenDevTools()
    Window:Show()
end
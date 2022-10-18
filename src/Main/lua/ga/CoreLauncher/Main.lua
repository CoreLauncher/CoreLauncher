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

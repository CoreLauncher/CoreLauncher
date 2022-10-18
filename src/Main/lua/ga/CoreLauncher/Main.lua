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

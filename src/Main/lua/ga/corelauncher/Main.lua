Import("ga.corelauncher.LoadLibraries")()

local function Object(t)
	local o = js.new(js.global.Object)
	for k, v in pairs(t) do
		assert(type(k) == "string" or js.typeof(k) == "symbol", "JavaScript only has string and symbol keys")
		o[k] = v
	end
	return o
end

_G.CoreLauncher = {}
CoreLauncher.DevMode = js.global.process.env.CORELAUNCHER_DEV == "true"
CoreLauncher.ApplicationData = TypeWriter.ApplicationData .. "/CoreLauncher/"

CoreLauncher.DataBase = js.new(Import("ga.corelauncher.DataBase"), CoreLauncher.ApplicationData .. "/Database.json")

CoreLauncher.Electron = Import("electronhelper")
CoreLauncher.ElectronApplication = CoreLauncher.Electron.app
Await(CoreLauncher.ElectronApplication:whenReady())

CoreLauncher.BrowserWindow = jsnew(
    CoreLauncher.Electron.BrowserWindow,
    Object(
        {
            show = false,
            autoHideMenuBar = true,
            center = true,
            frame = false,
            resizable = false,
            width = 275,
            height = 400
        }
    )
)
if CoreLauncher.DevMode then
    TypeWriter.Logger:Warning("We are running in dev env")
    TypeWriter.Logger:Warning("Skipping webserver")
    CoreLauncher.BrowserWindow:loadURL("http://localhost:9874")
    --CoreLauncher.BrowserWindow:openDevTools()
else
    CoreLauncher.StaticServer = Import("me.corebyte.static")("", 9875, "CoreLauncher", "Frontend")
    CoreLauncher.BrowserWindow:loadURL("http://localhost:9875")
end

CoreLauncher.BrowserWindow:on("ready-to-show", function()
    CoreLauncher.BrowserWindow:show()
end)
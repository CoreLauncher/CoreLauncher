Import("ga.corelauncher.LoadLibraries")()

local function Object(t)
	local o = js.new(js.global.Object)
	for k, v in pairs(t) do
		assert(type(k) == "string" or js.typeof(k) == "symbol", "JavaScript only has string and symbol keys")
		o[k] = v
	end
	return o
end

local FS = TypeWriter:JsRequire("fs-extra")

_G.CoreLauncher = {}
CoreLauncher.DevMode = js.global.process.env.CORELAUNCHER_DEV == "true"
CoreLauncher.ApplicationData = TypeWriter.ApplicationData .. "/CoreLauncher/"
FS:ensureDirSync(CoreLauncher.ApplicationData)

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
            resizable = false,
            width = 275,
            height = 400,
            titleBarStyle = "hidden"
        }
    )
)
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


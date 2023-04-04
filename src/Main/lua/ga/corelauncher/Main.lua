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
            frame = false
        }
    )
)
CoreLauncher.StaticServer = Import("me.corebyte.static")("", 9875, "CoreLauncher", "Frontend")
CoreLauncher.BrowserWindow:loadURL("http://localhost:9875")
CoreLauncher.BrowserWindow:on("ready-to-show", function()
    CoreLauncher.BrowserWindow:show()
end)

print("a")
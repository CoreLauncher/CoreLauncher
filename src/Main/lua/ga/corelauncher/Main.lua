Import("ga.corelauncher.LoadLibraries")()

local function Object(t)
	local o = js.new(js.global.Object)
	for k, v in pairs(t) do
		assert(type(k) == "string" or js.typeof(k) == "symbol", "JavaScript only has string and symbol keys")
		o[k] = v
	end
	return o
end

function easeInOutQuad(x)
    if x < 0.5 then
        return 2 * x * x
    else
        return 1 - ((-2 * x + 2) ^ 2) / 2
    end
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
    Wait(2)

    local Width = 1000 - 275
    local Height = 600 - 400
    for I = 0, 1, 0.005 do
        local SizeFactor = easeInOutQuad(I)
        local NewWidth = math.ceil(Width * SizeFactor) + 275
        local NewHeight = math.ceil(Height * SizeFactor) + 400
        print(SizeFactor)
        print(NewWidth, NewHeight)
        CoreLauncher.BrowserWindow:setSize(NewWidth, NewHeight)
        Wait(0.0005)
    end
end)



CoreLauncher.BrowserWindow:on("resize", function()
    print(CoreLauncher.BrowserWindow:getSize())
end)


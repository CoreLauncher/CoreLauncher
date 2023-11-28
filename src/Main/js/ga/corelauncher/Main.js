const FS = require("fs-extra")

globalThis.CoreLauncher = {}
CoreLauncher.DevMode = process.env.CORELAUNCHER_DEV == "true"
CoreLauncher.ApplicationData = `${TypeWriter.ApplicationData}/CoreLauncher`
CoreLauncher.PluginsFolder = `${CoreLauncher.ApplicationData}/Plugins`
CoreLauncher.PluginDataFolder = `${CoreLauncher.ApplicationData}/PluginData`

FS.ensureDirSync(CoreLauncher.ApplicationData)
FS.ensureDirSync(CoreLauncher.PluginsFolder)
FS.ensureDirSync(CoreLauncher.PluginDataFolder)

await(await Import("me.corebyte.NW"))(
    {
        Id: "CoreLauncher",
        Name: "CoreLauncher",
        Main: CoreLauncher.DevMode ? "http://localhost:9874" : "http://localhost:9875",
        Frame: false,
        Icon: {
            Win: "CoreLauncher:/ico.ico",
            Mac: "CoreLauncher:/ico.icns",
        }
    }
)

CoreLauncher.StaticServer = (await Import("me.corebyte.static"))(
    9875,
    "CoreLauncher",
    "Frontend"
)

window.onbeforeunload = function () {
    console.log("unloading")
    CoreLauncher.StaticServer.Close()
}

nw.Window.get().on(
    "close",
    function () {
        console.log("closing")
        CoreLauncher.StaticServer.Close()
        nw.Window.get().close(true)
    }
)

CoreLauncher.Logger = TypeWriter.CreateLogger("CoreLauncher")

const DataBaseClass = await Import("ga.corelauncher.Classes.DataBase")
const ScreenManagerClass = await Import("ga.corelauncher.Classes.ScreenManager")
const PluginManagerClass = await Import("ga.corelauncher.Classes.PluginManager")
const AccountManagerClass = await Import("ga.corelauncher.Classes.AccountManager")
const GameManagerClass = await Import("ga.corelauncher.Classes.GameManager")
const TaskManagerClass = await Import("ga.corelauncher.Classes.TaskManager")
const WindowControlClass = await Import("ga.corelauncher.Classes.WindowControl")

document.addEventListener(
    "DOMContentLoaded",
    async function () {
        CoreLauncher.DataBase = new DataBaseClass(`${CoreLauncher.ApplicationData}/Database.json`)
        CoreLauncher.ScreenManager = new ScreenManagerClass()
        await (await Import("ga.corelauncher.Screens.Registry"))(CoreLauncher.ScreenManager)
        await (await Import("ga.corelauncher.Helpers.DeSVG"))("img", false)

        CoreLauncher.PluginManager = new PluginManagerClass(CoreLauncher.PluginsFolder)
        await CoreLauncher.PluginManager.LoadPlugins()
        CoreLauncher.AccountManager = new AccountManagerClass(CoreLauncher.PluginManager.ListAccountTypes())
        CoreLauncher.GameManager = new GameManagerClass(CoreLauncher.PluginManager.ListGames())
        CoreLauncher.TaskManager = new TaskManagerClass()
        CoreLauncher.WindowControl = new WindowControlClass()

        CoreLauncher.ScreenManager.GetScreen("Main").Show()
    }
)


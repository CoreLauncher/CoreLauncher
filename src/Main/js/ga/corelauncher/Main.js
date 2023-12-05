const FS = require("fs-extra")
const Path = require("path")

const WaitForEvent = await Import("ga.corelauncher.Helpers.WaitForEvent")

const DataBaseClass = await Import("ga.corelauncher.Classes.DataBase")
const ScreenManagerClass = await Import("ga.corelauncher.Classes.ScreenManager")

class CoreLauncherClass {
    constructor() {
        this.DevMode = process.env.CORELAUNCHER_DEV == "true"
        this.RunId = require("uuid").v4()
        this.Logger = TypeWriter.CreateLogger("CoreLauncher")

        //Folders
        this.Logger.Information("Loading folders")
        this.ApplicationData = Path.normalize(`${TypeWriter.ApplicationData}/CoreLauncher`)
        this.PluginsFolder = Path.normalize(`${this.ApplicationData}/Plugins`)
        this.PluginDataFolder = Path.normalize(`${this.ApplicationData}/PluginData`)
        FS.ensureDirSync(this.ApplicationData)
        FS.ensureDirSync(this.PluginsFolder)
        FS.ensureDirSync(this.PluginDataFolder)

        //Load Classes
        this.Logger.Information("Loading classes")
        this.DataBase = new DataBaseClass(`${this.ApplicationData}/Database.json`)

        this.Plugins = {}
    }

    async AsyncLoad() {
        //Register Screens
        this.ScreenManager = new ScreenManagerClass()
        const ScreenRegistry = await Import("ga.corelauncher.Screens.Registry")
        await ScreenRegistry(this.ScreenManager)
    }

    async LoadPlugins() {
        CoreLauncher.Logger.Information(`Loading plugins from ${this.PluginsFolder}`)
        const Files = FS.readdirSync(this.PluginsFolder)
        for (const FileName of Files) {
            const FilePath = Path.normalize(`${this.PluginsFolder}/${FileName}`)
            const Plugin = await TypeWriter.LoadFile(FilePath)
            if (!Plugin.PackageInfo.Entrypoints.CoreLauncherPlugin) { continue }
            CoreLauncher.Logger.Information(`Loading plugin ${Plugin.PackageInfo.Id}`)
            const PluginDataFolder = `${this.PluginDataFolder}/${Plugin.PackageInfo.Id}`
            FS.ensureDirSync(PluginDataFolder)

            const PluginClass = await Plugin.LoadEntrypoint("CoreLauncherPlugin")
            const PluginInstance = new PluginClass(PluginDataFolder)
            this.Plugins[Plugin.PackageInfo.Id] = PluginInstance
            await PluginInstance.Load()
        }
    }

    ListGames() {
        return Object.values(this.Plugins).flatMap(Plugin => Plugin.Games)
    }
    
    GetGame(Id) {
        return this.ListGames().find(Game => Game.Id == Id)
    }

    ListAccountTypes() {
        return Object.values(this.Plugins).flatMap(Plugin => Plugin.AccountTypes)
    }

    GetAccountType(Id) {
        return this.ListAccountTypes().find(AccountType => AccountType.Id == Id)
    }

    ListPlugins() {
        return Object.values(this.Plugins)
    }
}

const CoreLauncher = new CoreLauncherClass()
globalThis.CoreLauncher = CoreLauncher
await WaitForEvent(document, "DOMContentLoaded")
await CoreLauncher.AsyncLoad()
await CoreLauncher.LoadPlugins()

await CoreLauncher.ScreenManager.GetScreen("Main").Show()

// document.addEventListener(
//     "DOMContentLoaded",
//     async function () {
//         CoreLauncher.DataBase = new DataBaseClass(`${CoreLauncher.ApplicationData}/Database.json`)
//         CoreLauncher.ScreenManager = new ScreenManagerClass()
//         await (await Import("ga.corelauncher.Screens.Registry"))(CoreLauncher.ScreenManager)
//         await (await Import("ga.corelauncher.Helpers.DeSVG"))()

//         CoreLauncher.PluginManager = new PluginManagerClass(CoreLauncher.PluginsFolder)
//         await CoreLauncher.PluginManager.LoadPlugins()
//         CoreLauncher.AccountManager = new AccountManagerClass(CoreLauncher.PluginManager.ListAccountTypes())
//         CoreLauncher.GameManager = new GameManagerClass(CoreLauncher.PluginManager.ListGames())
//         CoreLauncher.TaskManager = new TaskManagerClass()
//         CoreLauncher.WindowControl = new WindowControlClass()

//         // await CoreLauncher.ScreenManager.GetScreen("Main").Show()
//         await CoreLauncher.GameManager.Games[0].OpenSettings()

//     }
// )
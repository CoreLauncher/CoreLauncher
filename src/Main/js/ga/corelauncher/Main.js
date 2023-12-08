const FS = require("fs-extra")
const Path = require("path")
const Express = require("express")

const WaitForEvent = await Import("ga.corelauncher.Helpers.WaitForEvent")
const OpenMainSettings = await Import("ga.corelauncher.Helpers.OpenMainSettings")

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

        //Load event server
        this.Logger.Information("Loading event server")
        this.EventServer = Express()
        const EventHttpsServer = this.EventServer.listen(9876)
        this.Logger.Information("Event listening on port 9876")
        
        this.EventServer.get(
            "/accountlink",
            async (Request, Response) => {
                console.log(Request.query)
                if (!Request.query.d) { return }
                const Data = JSON.parse(Buffer.from(Request.query.d, "base64").toString("utf8"))
                const AccountType = CoreLauncher.GetAccountType(Data.Type)
                if (!AccountType) { return }
                if (!await AccountType.ConnectionDataValid(Data.Data)) { OpenMainSettings("Accounts"); return }
                const AccountInstance = AccountType.CreateInstance()
                await AccountInstance.FromConnectionData(Data.Data)
                OpenMainSettings("Accounts")
            }
        )

        nw.Window.get().on(
            "close",
            () => {
                EventHttpsServer.close()
                nw.Window.get().close(true)
            }
        )

        window.onbeforeunload = EventHttpsServer.close

        //Data
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
        return this.ListAccountTypes().find(AccountType => AccountType.Type == Id)
    }

    ListAccountInstances(Type) {
        const Instances = this.ListAccountTypes().flatMap(AccountType => AccountType.AccountInstances)
        if (Type) { return Instances.filter(Instance => Instance.Type == Type) }
        return Instances
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
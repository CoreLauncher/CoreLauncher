const FS = require('fs-extra')
const Path = require('path')
const ResourceBase64 = await Import("ga.corelauncher.Helpers.ResourceBase64")

class PluginManager {
    constructor(PluginFolder) {
        this.PluginFolder = Path.normalize(PluginFolder)
        this.Plugins = {}
    }

    async LoadPlugins() {
        TypeWriter.Logger.Information(`Loading plugins from ${this.PluginFolder}`)
        const Files = FS.readdirSync(this.PluginFolder)
        for (const FileName of Files) {
            const FilePath = Path.normalize(`${this.PluginFolder}/${FileName}`)
            const Plugin = await TypeWriter.LoadFile(FilePath)
            if (!Plugin.PackageInfo.Entrypoints.CoreLauncherPlugin) { continue }
            const PluginDataFolder = `${CoreLauncher.PluginDataFolder}/${Plugin.PackageInfo.Id}`
            FS.ensureDirSync(PluginDataFolder)

            const PluginClass = await Plugin.LoadEntrypoint("CoreLauncherPlugin")
            const PluginInstance = new PluginClass(PluginDataFolder)
            console.log(PluginInstance)
            this.Plugins[Plugin.PackageInfo.Id] = PluginInstance
            await PluginInstance.Load()
        }
    }

    GetSharedData(Id) {
        return this.Plugins[Id].Data
    }

    ListGames() {
        return Object.values(this.Plugins).flatMap(Plugin => Plugin.Games)
    }

    ListAccountTypes() {
        const AccountTypes = {}

        return Object.values(this.Plugins).flatMap(Plugin => Plugin.AccountTypes)
    }

    ListPluginIds() {
        return Object.keys(this.Plugins)
    }

    GetPluginInformation(PluginId) {
        return this.Plugins[PluginId]
    }

    GetPluginIconBase64(PluginId) {
        return ResourceBase64(this.Plugins[PluginId].Icon)
    }
}

return PluginManager
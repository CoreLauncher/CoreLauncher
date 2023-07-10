const FS = require('fs')
const ResourceBase64 = Import("ga.corelauncher.Libraries.ResourceBase64")

class PluginManager {
    constructor(PluginFolder) {
        this.PluginFolder = PluginFolder
        this.Plugins = {}

        TypeWriter.Logger.Information(`Loading plugins from ${this.PluginFolder}`)
        const Files = FS.readdirSync(this.PluginFolder)

        for (const FileName of Files) {
            TypeWriter.Logger.Information(`Loading plugin ${FileName}`)
            const FilePath = `${this.PluginFolder}/${FileName}`
            const Plugin = TypeWriter.LoadFile(FilePath)
            if (Plugin.Entrypoints.CoreLauncherPlugin) {
                const PluginData = TypeWriter.LoadEntrypoint(Plugin.Id, "CoreLauncherPlugin")
                this.Plugins[Plugin.Id] = PluginData
            }
        }
    }

    ListGames() {
        const Games = {}

        for (const PluginId in this.Plugins) {
            const PluginData = this.Plugins[PluginId]
            if (!PluginData.Games) { continue }
            for (const GameData of PluginData.Games) {
                Games[GameData.Id] = GameData
            }
        }

        return Games
    }

    ListAccountTypes() {
        const AccountTypes = {}

        for (const PluginId in this.Plugins) {
            const PluginData = this.Plugins[PluginId]
            if (!PluginData.AccountTypes) { continue }
            for (const AccountTypeData of PluginData.AccountTypes) {
                AccountTypes[AccountTypeData.Id] = AccountTypeData
            }
        }

        return AccountTypes
    }

    ListPluginIds() {
        const PluginIds = []

        for (const PluginId in this.Plugins) {
            PluginIds.push(PluginId)
        }

        return PluginIds
    }

    GetPluginInformation(PluginId) {
        return this.Plugins[PluginId]
    }

    GetPluginIconBase64(PluginId) {
        return ResourceBase64(this.Plugins[PluginId].Icon)
    }
}

module.exports = PluginManager
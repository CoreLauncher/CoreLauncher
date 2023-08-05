const ResourceBase64 = Import("ga.corelauncher.Libraries.ResourceBase64")
const UUID = require("uuid").v4

class GameManager {
    constructor(Games) {
        this.Games = Games

        for (const GameId in Games) {
            CoreLauncher.DataBase.SetKeyIfNotExists(`Game.${GameId}.Properties`, this.ListDefaultGameProperties(GameId))
            CoreLauncher.DataBase.SetKeyIfNotExists(`Game.${GameId}.Instances`, {})

        }
    }

    ListGames() {
        return this.Games
    }

    GetGame(GameId) {
        return this.Games[GameId]
    }

    //#region Images
    GetGameIconBase64(GameId) {
        return ResourceBase64(this.Games[GameId].Icon)
    }

    GetGameBannerBase64(GameId) {
        return ResourceBase64(this.Games[GameId].Banner)
    }

    GetValidAccounts(GameId) {
        const Accounts = CoreLauncher.AccountManager.ListAccounts()
        const ValidAccounts = Accounts.filter(this.Games[GameId].IsAccountValid)
        return ValidAccounts
    }
    //#endregion

    //#region Game properties
    ListGameProperties(GameId) {
        return this.Games[GameId].GameProperties
    }

    ListDefaultGameProperties(GameId) {
        const Properties = this.ListGameProperties(GameId)
        const DefaultProperties = {}

        for (const PropertyRow of Properties) {
            for (const Property of PropertyRow) {
                DefaultProperties[Property.Id] = Property.Default
            }
        }

        return DefaultProperties
    }

    SetGameProperties(GameId, Properties) {
        CoreLauncher.DataBase.SetKey(`Game.${GameId}.Properties`, Properties)
    }

    GetGameProperties(GameId) {
        return CoreLauncher.DataBase.GetKey(`Game.${GameId}.Properties`)
    }
    //#endregion

    ListInstanceVersions(GameId) {
        return this.Games[GameId].InstanceVersions
    }

    async ListInstanceVersionValues(GameId, InstanceVersionId, Values) {
        const InstanceVersions = this.ListInstanceVersions(GameId)
        const InstanceVersion = InstanceVersions.filter(InstanceVersion => InstanceVersion.Id == InstanceVersionId)[0]
        const ObtainedValues = await InstanceVersion.ObtainValues(Values)
        return ObtainedValues
    }

    ListInstanceProperties(GameId) {
        return this.Games[GameId].InstanceProperties
    }

    CreateInstance(GameId, InstanceData) {
        console.log(GameId, InstanceData)

        InstanceData.UUID = UUID()

        CoreLauncher.DataBase.SetKey(`Game.${GameId}.Instances.${InstanceData.UUID}`, InstanceData)
    }

    ListInstances(GameId) {
        return Object.values(CoreLauncher.DataBase.GetKey(`Game.${GameId}.Instances`))
    }

    GetInstance(GameId, InstanceId) {
        return CoreLauncher.DataBase.GetKey(`Game.${GameId}.Instances.${InstanceId}`)
    }

    GetInstanceProperties(GameId, InstanceId) {
        return this.GetInstance(GameId, InstanceId).Properties
    }

    

}

module.exports = GameManager
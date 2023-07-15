const ResourceBase64 = Import("ga.corelauncher.Libraries.ResourceBase64")

class GameManager {
    constructor(Games) {
        this.Games = Games
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

    

}

module.exports = GameManager
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
class GameInstance {
    constructor(InstanceData, Game) {
        this.InstanceData = InstanceData
        this.Game = Game
    }

    SuperConstructor() {

    }

    async OpenSettings() {
        const Screen = CoreLauncher.ScreenManager.GetScreen("Main.Settings")
        const ScreenData = {
            Title: "Settings for " + this.GetName(),
            Tabs: []
        }

        ScreenData.Tabs.push("Instance Settings")
        ScreenData.Tabs.push(
            {
                Name: "Information",
                Screen: "InstanceInformation",
                Data: this
            }
        )

        await Screen.Hide()
        await Screen.Show(ScreenData)
    }

    GetName() {
        return this.InstanceData.Name
    }

    GetId() {
        return this.InstanceData.UUID
    }

    GetGame() {
        return this.Game
    }

    Properties() {
        return this.Game.InstanceProperties()
    }

    GetProperties() {
        return this.InstanceData.Properties
    }

    SetProperty(PropertyId, Value) {
        this.InstanceData.Properties[PropertyId] = Value
        this.Save()
    }

    Versions() {
        return this.Game.InstanceVersions()
    }

    GetVersions() {
        return this.InstanceData.Versions
    }

    SetVersion(VersionType, VersionId) {
        this.InstanceData.Versions[VersionType] = VersionId
        this.Save()
    }

    GetLastPlayed() {
        return this.InstanceData.LastPlayed || 0
    }

    SetLastPlayed() {
        this.InstanceData.LastPlayed = Date.now()
        this.Save()
    }

    Save() {
        CoreLauncher.DataBase.SetKey(`Game.${this.Game.Id}.Instances.${this.GetId()}`, this.InstanceData)
    }

    Delete() {
        delete this.Game.Instances[this.GetId()]
        CoreLauncher.DataBase.RemoveKey(`Game.${this.Game.Id}.Instances.${this.GetId()}`)
    }
}

return GameInstance
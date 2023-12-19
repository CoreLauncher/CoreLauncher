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

    Save() {
        CoreLauncher.DataBase.SetKey(`Game.${this.Game.Id}.Instances.${this.InstanceData.UUID}`, this.InstanceData)
    }
}

return GameInstance
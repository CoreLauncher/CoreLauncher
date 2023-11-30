const ResourceBase64 = await Import("ga.corelauncher.Helpers.ResourceBase64")

class Game {
    constructor() {
        CoreLauncher.DataBase.SetKeyIfNotExists(`Game.${this.Id}.Properties`, this.DefaultGameProperties())
        CoreLauncher.DataBase.SetKeyIfNotExists(`Game.${this.Id}.Instances`, {})
    }

    DefaultGameProperties() {
        const Properties = this.GameProperties()
        const DefaultProperties = {}

        for (const PropertyRow of Properties) {
            for (const Property of PropertyRow) {
                DefaultProperties[Property.Id] = Property.Default
            }
        }

        return DefaultProperties
    }

    GetIconBase64() {
        return ResourceBase64(this.Icon)
    }

    GetBannerBase64() {
        return ResourceBase64(this.Banner)
    }

    OpenSettings() {
        const Screen = CoreLauncher.ScreenManager.GetScreen("Main.Settings")
        const ScreenData = {
            Title: "Settings for " + this.Name,
            Tabs: []
        }

        ScreenData.Tabs.push("Game Settings")
        ScreenData.Tabs.push(
            {
                Name: "Game Information",
                Screen: "GameInformation",
                Data: [this]
            }
        )

        if (this.UsesInstances) {
            ScreenData.Tabs.push(
                {
                    Name: "Instances",
                    Screen: "Instances",
                    Data: [this]
                }
            )
        }

        Screen.Show(ScreenData)
    }
}

return Game
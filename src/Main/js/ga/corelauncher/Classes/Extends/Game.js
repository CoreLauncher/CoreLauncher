const ResourceBase64 = await Import("ga.corelauncher.Helpers.ResourceBase64")

class Game {
    constructor() {
        CoreLauncher.DataBase.SetKeyIfNotExists(`Game.${this.Id}.Properties`, this.DefaultProperties())
        CoreLauncher.DataBase.SetKeyIfNotExists(`Game.${this.Id}.Instances`, {})
    }

    DefaultProperties() {
        const DefaultProperties = {}

        for (const PropertyRow of this.Properties()) {
            for (const Property of PropertyRow) {
                DefaultProperties[Property.Id] = Property.Default
            }
        }

        return DefaultProperties
    }

    SetProperties(Properties) {
        CoreLauncher.DataBase.SetKey(`Game.${this.Id}.Properties`, Properties)
    }

    GetProperties(FillDefaults=false) {
        return CoreLauncher.DataBase.GetKey(`Game.${this.Id}.Properties`)
    }

    GetIconBase64() {
        return ResourceBase64(this.Icon)
    }

    GetBannerBase64() {
        return ResourceBase64(this.Banner)
    }

    async OpenSettings() {
        const Screen = CoreLauncher.ScreenManager.GetScreen("Main.Settings")
        const ScreenData = {
            Title: "Settings for " + this.Name,
            Tabs: []
        }

        ScreenData.Tabs.push("Game Settings")
        ScreenData.Tabs.push(
            {
                Name: "Information",
                Screen: "GameInformation",
                Data: this
            }
        )

        if (this.UsesInstances) {
            ScreenData.Tabs.push(
                {
                    Name: "Instances",
                    Screen: "Instances",
                    Data: this
                }
            )
        }

        await Screen.Hide()
        await Screen.Show(ScreenData)
    }
}

return Game
const ResourceBase64 = await Import("ga.corelauncher.Helpers.ResourceBase64")

class Game {
    constructor() {

    }

    SuperConstructor() {
        CoreLauncher.DataBase.SetKeyIfNotExists(`Game.${this.Id}.Properties`, this.DefaultProperties())
        CoreLauncher.DataBase.SetKeyIfNotExists(`Game.${this.Id}.Instances`, {})

        const SavedInstanceData = Object.values(CoreLauncher.DataBase.GetKey(`Game.${this.Id}.Instances`))
        for (const InstanceData of SavedInstanceData) {
            CoreLauncher.Logger.Information(`Loading instance ${InstanceData.Name} for game ${this.Id} (${InstanceData.UUID})`)
            this.AddInstance(InstanceData)
        }
    }

    // Instances
    AddInstance(InstanceData) {
        if (!this.Instances) { this.Instances = {} }
        const Instance = new this.GameInstanceClass(InstanceData, this)
        this.Instances[InstanceData.UUID] = Instance
        Instance.Save()
        return Instance
    }

    ListInstances() {
        if (!this.Instances) { this.Instances = {} }
        return Object.values(this.Instances)
    }

    GetInstance(InstanceId) {
        if (!this.Instances) { this.Instances = {} }
        return this.Instances[InstanceId]
    }

    // Game Properties
    DefaultProperties() {
        const DefaultProperties = {}

        for (const PropertyRow of this.Properties()) {
            for (const Property of PropertyRow) {
                DefaultProperties[Property.Id] = Property.Default
            }
        }

        return DefaultProperties
    }

    SetProperty(Id, Value) {
        CoreLauncher.DataBase.SetKey(`Game.${this.Id}.Properties.${Id}`, Value)
    }

    SetProperties(Properties) {
        CoreLauncher.DataBase.SetKey(`Game.${this.Id}.Properties`, Properties)
    }

    GetProperties(FillDefaults=false) {
        return CoreLauncher.DataBase.GetKey(`Game.${this.Id}.Properties`)
    }

    // Accounts
    GetIconBase64() {
        return ResourceBase64(this.Icon)
    }

    GetBannerBase64() {
        return ResourceBase64(this.Banner)
    }

    // Ui shortcuts
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
                    Data: this,
                    Default: true
                }
            )
        }

        await Screen.Hide()
        await Screen.Show(ScreenData)
    }
}

return Game
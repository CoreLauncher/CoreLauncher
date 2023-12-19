const PropertiesRenderer = await Import("ga.corelauncher.Helpers.PropertiesRenderer")
const VersionsRenderer = await Import("ga.corelauncher.Helpers.VersionsRenderer")

let InstanceVersions
let InstanceProperties

return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {

    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Instance) {
        ScreenElement.querySelector(".instancename").value = Instance.GetName()
        const PropertiesHolder = ScreenElement.querySelector(".propertiesholder")
        PropertiesHolder.innerHTML = ""
        PropertiesRenderer.Render(
            PropertiesHolder,
            Instance.Properties(),
            Instance.GetProperties(),
            function(Value, PropertyData) {
                Instance.SetProperty(PropertyData.Id, Value)
            }
        )

        const VersionsHolder = ScreenElement.querySelector(".versionsholder")
        VersionsRenderer.RenderVersions(
            VersionsHolder,
            Instance.Versions(),
            Instance.GetVersions()
        )

    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Instance) {

    }
}
const Focus = await Import("ga.corelauncher.Helpers.Focus")
const PropertiesRenderer = await Import("ga.corelauncher.Helpers.PropertiesRenderer")
const VersionsRenderer = await Import("ga.corelauncher.Helpers.VersionsRenderer")
const CreateUUID = require("uuid").v4

let InstanceVersions
let InstanceProperties

return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {
        ScreenElement.querySelector(".cancelbutton").addEventListener("click", () => { Screen.ParentScreen.GetScreen("List").Show(Screen.Data) })

        VersionTemplate = ScreenElement.querySelector(".versionsholder .version")
        VersionTemplate.remove()

        const VersionsHolder = ScreenElement.querySelector(".versionsholder")

        ScreenElement.querySelector(".createbutton").addEventListener(
            "click",
            async () => {
                const VersionValues = await VersionsRenderer.GetVersionValues(VersionsHolder)
                const VersionElements = await VersionsRenderer.GetVersionElements(VersionsHolder)
                console.log(VersionValues)
                for (const VersionId in VersionValues) {
                    const VersionValue = VersionValues[VersionId]
                    if (VersionValue == undefined) {
                        Focus(VersionElements[VersionId], 1000, "#ff0000")
                    }
                }
                if (Object.values(VersionValues).includes(null)) { return }
                const InstanceData = {
                    Name: ScreenElement.querySelector(".instancename").value,
                    Versions: VersionValues,
                    Properties: InstanceProperties,
                    UUID: CreateUUID()
                }
                if (InstanceData.Name.trim() == "") {
                    InstanceData.Name = "New Instance"
                }

                Screen.Data.AddInstance(InstanceData)
                console.log(InstanceData)
                Screen.ParentScreen.GetScreen("List").Show(Screen.Data)
            }
        )
    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Game) {
        InstanceVersions = Game.InstanceVersions()
        VersionElements = {}
        console.log(InstanceVersions)

        const VersionsHolder = ScreenElement.querySelector(".versionsholder")
        VersionsRenderer.RenderVersions(
            VersionsHolder,
            InstanceVersions
        )

        const PropertiesHolder = ScreenElement.querySelector(".propertiesholder")
        PropertiesHolder.innerHTML = ""

        InstanceProperties = {}
        PropertiesRenderer.Render(
            PropertiesHolder,
            await Game.InstanceProperties(),
            {},
            function(Value, PropertyData) {
                console.log(Value, PropertyData)
                InstanceProperties[PropertyData.Id] = Value
            }
        )
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {

    }
}
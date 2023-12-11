const Focus = await Import("ga.corelauncher.Helpers.Focus")
const PropertiesRenderer = await Import("ga.corelauncher.Helpers.PropertiesRenderer")
const CreateUUID = require("uuid").v4

let VersionTemplate
let InstanceVersions
let VersionElements
let InstanceProperties

function GetVersionValues() {
    const Versions = {}
    for (const Version of InstanceVersions) {
        const VersionElement = VersionElements[Version.Id]
        Versions[Version.Id] = VersionElement.getAttribute("value")
    }
    return Versions
}

return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {
        ScreenElement.querySelector(".cancelbutton").addEventListener("click", () => { Screen.ParentScreen.GetScreen("List").Show(Screen.Data) })

        VersionTemplate = ScreenElement.querySelector(".versionsholder .version")
        VersionTemplate.remove()

        ScreenElement.querySelector(".createbutton").addEventListener(
            "click",
            () => {
                const VersionValues = GetVersionValues()
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
        VersionsHolder.innerHTML = ""

        function EmptyVersionsAfter(VersionData) {
            let VersionFound = false
            for (const Version of InstanceVersions) {
                if (VersionFound) {
                    const VersionElement = VersionElements[Version.Id]
                    VersionElement.classList.remove("loaded")
                    VersionElement.classList.add("empty")
                } else if (VersionData.Id == Version.Id) {
                    VersionFound = true
                }
            }
        }

        async function RenderVersion(VersionData) {
            const VersionElement = VersionElements[VersionData.Id]
            VersionElement.classList.remove("empty")
            VersionElement.classList.remove("loaded")
            VersionElement.classList.add("loading")
            const VersionsList = VersionElement.querySelector(".versions")
            VersionsList.innerHTML = ""
            EmptyVersionsAfter(VersionData)

            const VersionValues = await VersionData.ObtainValues(GetVersionValues())
            for (const VersionId in VersionValues) {
                const VersionName = VersionValues[VersionId]
                const VersionEntryElement = document.createElement("a")
                VersionEntryElement.classList.add("versionentry")
                VersionEntryElement.innerText = VersionName
                VersionsList.appendChild(VersionEntryElement)
                VersionEntryElement.addEventListener(
                    "click",
                    async () => {
                        const SelectedVersion = VersionsList.querySelector(".selected")
                        if (SelectedVersion) { SelectedVersion.classList.remove("selected") }
                        VersionEntryElement.classList.add("selected")
                        VersionElement.setAttribute("value", VersionId)
                        let VersionFound = false
                        for (const Version of InstanceVersions) {
                            if (VersionFound) {
                                await RenderVersion(Version)
                                break
                            } else if (VersionData.Id == Version.Id) {
                                VersionFound = true
                            }
                        }
                    }
                )
            }
            VersionElement.classList.remove("loading")
            VersionElement.classList.add("loaded")
        }

        for (const Version of InstanceVersions) {
            const VersionElement = VersionTemplate.cloneNode(true)
            VersionElement.querySelector(".name").innerText = Version.Name
            VersionElements[Version.Id] = VersionElement
            VersionsHolder.appendChild(VersionElement)
        }

        await RenderVersion(InstanceVersions[0])

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
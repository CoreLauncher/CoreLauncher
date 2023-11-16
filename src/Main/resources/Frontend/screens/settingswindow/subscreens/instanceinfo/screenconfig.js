const Screen = {}

let GameId
let InstanceId
Screen.Init = async function (ScreenElement, Screen) {
    ScreenElement.querySelector(".deletebutton").addEventListener(
        "click",
        async function () {
            await CoreLauncher.GameManager.RemoveInstance(GameId, InstanceId)
            CoreLauncher.Settings.OpenGameSettings(GameId, true, true)
        }
    )

    ScreenElement.querySelector(".instancetitle").addEventListener(
        "change",
        async function () {
            await CoreLauncher.GameManager.SetInstanceName(GameId, InstanceId, this.value)
        }
    )
}

Screen.Show = async function (ScreenElement, Screen, Data) {
    GameId = Data[0]
    InstanceId = Data[1]
    console.log(GameId, InstanceId, Data)

    const InstanceData = await CoreLauncher.GameManager.GetInstance(GameId, InstanceId)
    console.log(InstanceData)

    ScreenElement.querySelector(".instancetitle").value = InstanceData.Name

    // Render instance versions
    const VersionsHolder = ScreenElement.querySelector(".versionsholder")
    VersionsHolder.innerHTML = ""
    const InstanceVersions = await CoreLauncher.GameManager.ListInstanceVersions(GameId)

    for (const Version of InstanceVersions) {
        console.log(Version)
        const VersionElement = document.createElement("div")
        VersionElement.classList.add("version")
        VersionsHolder.appendChild(VersionElement)

        const VersionHeaderElement = document.createElement("a")
        VersionHeaderElement.classList.add("versionheader")
        VersionHeaderElement.innerText = `${Version.Name}${Version.Editable ? "" : "*"}`
        VersionElement.appendChild(VersionHeaderElement)

        if (Version.Editable) {
            const VersionsSelectorElement = document.createElement("select")
            VersionsSelectorElement.classList.add("versionselector")
            VersionElement.appendChild(VersionsSelectorElement)

            const VersionEntries = await CoreLauncher.GameManager.ListInstanceVersionValues(GameId, Version.Id, InstanceData.Versions)

            for (const VersionEntryId in VersionEntries) {
                const VersionEntryName = VersionEntries[VersionEntryId]
                const VersionOptionElement = document.createElement("option")
                VersionOptionElement.value = VersionEntryId
                VersionOptionElement.innerText = VersionEntryName
                VersionsSelectorElement.appendChild(VersionOptionElement)            
            }

            VersionsSelectorElement.value = InstanceData.Versions[Version.Id]
            VersionsSelectorElement.addEventListener(
                "change",
                async function () {
                    console.log(`Version ${Version.Id} changed to ${this.value}`)
                    await CoreLauncher.GameManager.SetInstanceVersion(GameId, InstanceId, Version.Id, this.value)
                }
            )
        } else {
            const VersionValueElement = document.createElement("div")
            VersionValueElement.classList.add("versionvalue")
            VersionValueElement.innerText = InstanceData.Versions[Version.Id]
            VersionElement.appendChild(VersionValueElement)
        }

    }

    // Render instance properties
    CoreLauncher.Properties.Render(
        await CoreLauncher.GameManager.ListInstanceProperties(GameId),
        ScreenElement.querySelector(".propertiesholder"),
        async function (Property, PropertyList, Element, PropertiesHolder) {
            console.log(`Property ${Property.Id} changed to ${Element.value}`)

            await CoreLauncher.GameManager.SetInstanceProperties(
                GameId,
                InstanceId,
                CoreLauncher.Properties.Collect(
                    PropertyList,
                    PropertiesHolder
                )
            )
        },
        await CoreLauncher.GameManager.GetInstanceProperties(GameId, InstanceId, false)
    )

    ScreenElement.querySelector(".instanceidtext").innerText = InstanceId

}

export default Screen
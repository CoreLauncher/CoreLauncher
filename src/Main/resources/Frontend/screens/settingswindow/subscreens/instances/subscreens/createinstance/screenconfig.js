const Screen = {}

var Game
var VersionSelectorTemplate
var VersionList
Screen.Init = function (ScreenElement, Screen) {
    // Create button
    const CreateButton = ScreenElement.querySelector(".createbutton")
    CreateButton.addEventListener(
        "click",
        async function () {
            const InstanceProperties = await CoreLauncher.GameManager.ListInstanceProperties(Game)
            const InstancePropertiesValues = CoreLauncher.Properties.Collect(InstanceProperties, ScreenElement.querySelector(".instanceproperties"))
            console.log(InstancePropertiesValues)

            const InstanceVersionTypes = await CoreLauncher.GameManager.ListInstanceVersions(Game)
            const InstanceVersions = ListSelectorValues()
            console.log(InstanceVersions)

            //#region Gather issues
            const IssuesDisplay = ScreenElement.querySelector(".issuesdisplay")
            const Issues = []
            for (const VersionKey in InstanceVersions) {
                const VersionValue = InstanceVersions[VersionKey]
                const VersionData = InstanceVersionTypes.find(Version => Version.Id == VersionKey)
                if (VersionValue == undefined) {
                    Issues.push(
                        {
                            Message: `The following version is not selected: "${VersionData.Name}"`,
                            Element: ListVersionSelectors().find(VersionSelector => VersionSelector.dataset.versionid == VersionKey)
                        }
                    )
                }
            }
            //#endregion

            //#region Show issues
            if (Issues.length != 0) {
                IssuesDisplay.style.display = null
                const IssuesHolder = IssuesDisplay.querySelector(".issuestobefixed")
                IssuesHolder.innerHTML = ""

                for (const Issue of Issues) {
                    const IssueElement = document.createElement("a")
                    IssueElement.innerText = `↪ ${Issue.Message}`
                    IssuesHolder.appendChild(IssueElement)

                    const LineBreak = document.createElement("br")
                    IssuesHolder.appendChild(LineBreak)
                }

                for (const Issue of Issues) {
                    UserFocus(
                        Issue.Element,
                        1, 10,
                        200, 0, 0
                    )
                }

                return
            } else {
                IssuesDisplay.style.display = "none"
            }
            //#endregion


            const InstanceNameElement = ScreenElement.querySelector(".instancename")

            const CompiledData = {
                Game: Game,
                Name: InstanceNameElement.value == "" ? "New Instance" : InstanceNameElement.value,
                Properties: InstancePropertiesValues,
                Versions: InstanceVersions
            }

            console.log(CompiledData)

            await CoreLauncher.GameManager.CreateInstance(Game, CompiledData)
            Screen.ParentScreen.GetScreen("instancelist").Show(false, Game)
        }
    )

    // Cancel button
    ScreenElement.querySelector(".cancelbutton").addEventListener(
        "click",
        function () {
            Screen.ParentScreen.GetScreen("instancelist").Show(false, Game)
        }
    )

    VersionSelectorTemplate = ScreenElement.querySelector(".versionselector")
    VersionSelectorTemplate.remove()

    VersionList = ScreenElement.querySelector(".versionlist")
}

//#region Version selector functions
function ListVersionSelectors() {
    return Array.from(VersionList.childNodes)
}

function ListSelectorValues() {
    const Values = {}
    for (const VersionSelector of ListVersionSelectors()) {
        Values[VersionSelector.dataset.versionid] = VersionSelector.dataset.value == "undefined" ? undefined : VersionSelector.dataset.value
    }
    return Values
}

function EmptySelectorsAfter(Index) {
    const VersionSelectors = ListVersionSelectors()
    for (const VersionSelector of VersionSelectors) {
        const SelectorIndex = Number(VersionSelector.dataset.index)
        if (SelectorIndex > Index) {
            VersionSelector.querySelector(".versionentries").innerHTML = ""
            VersionSelector.dataset.value = undefined
            VersionSelector.classList.add("isempty")
        }
    }
}

async function LoadSelectorValues(Index) {
    EmptySelectorsAfter(Index)
    const VersionSelector = ListVersionSelectors()[Index]
    if (!VersionSelector) { return }
    VersionSelector.querySelector(".versionentries").innerHTML = ""
    VersionSelector.classList.add("isloading")
    VersionSelector.classList.remove("isempty")

    const VersionEntries = await CoreLauncher.GameManager.ListInstanceVersionValues(Game, VersionSelector.dataset.versionid, ListSelectorValues())

    for (const EntryId in VersionEntries) {
        const EntryValue = VersionEntries[EntryId]

        const EntryElement = document.createElement("a")
        EntryElement.classList.add("versionentry")
        EntryElement.innerText = EntryValue

        EntryElement.addEventListener(
            "click",
            async function() {
                if (VersionSelector.dataset.value === EntryId) { return }
                VersionSelector.dataset.value = EntryId

                RemoveClassFromChildren(VersionSelector.querySelector(".versionentries"), "selected")
                EntryElement.classList.add("selected")

                await LoadSelectorValues(Index + 1)
            }
        )

        VersionSelector.querySelector(".versionentries").appendChild(EntryElement)
    }

    VersionSelector.classList.remove("isloading")

}
//#endregion

Screen.Show = async function (ScreenElement, Screen, Data) {
    Game = Data

    ScreenElement.querySelector(".issuesdisplay").style.display = "none"
    ScreenElement.querySelector(".instancename").value = ""

    //#region Version selector loading
    const Versions = await CoreLauncher.GameManager.ListInstanceVersions(Game)
    VersionList.innerHTML = ""

    for (const VersionIndex in Versions) {
        const Version = Versions[VersionIndex]
        const VersionSelector = VersionSelectorTemplate.cloneNode(true)
        VersionSelector.querySelector(".versionname").innerText = Version.Name + (Version.Editable ? "" : "*")
        VersionSelector.dataset.versionid = Version.Id
        VersionSelector.dataset.index = VersionIndex
        VersionList.appendChild(VersionSelector)
    }

    await LoadSelectorValues(0)
    //#endregion

    //#region Instance properties
    const PropertyHolder = ScreenElement.querySelector(".instanceproperties")
    const InstanceProperties = await CoreLauncher.GameManager.ListInstanceProperties(Game)
    PropertyHolder.innerHTML = ""

    CoreLauncher.Properties.Render(InstanceProperties, PropertyHolder)
    //#endregion
}

export default Screen
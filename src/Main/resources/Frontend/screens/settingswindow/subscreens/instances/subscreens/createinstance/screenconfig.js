const Screen = {}

var Game
var VersionSelectorTemplate
var VersionList
Screen.Init = function (ScreenElement, Screen) {
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
}

export default Screen
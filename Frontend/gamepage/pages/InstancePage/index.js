var SelectedInstance = null
var Game
var InstanceProperties
var OnEditBlocks
var InstanceTemplate
var ModTemplate
var OnInstanceChange

//https://stackoverflow.com/a/7641822
function PrettyDate(time) {
    var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);

    if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return;

    return day_diff == 0 && (
    diff < 60 && "just now" || diff < 120 && "1 minute ago" || diff < 3600 && Math.floor(diff / 60) + " minutes ago" || diff < 7200 && "1 hour ago" || diff < 86400 && Math.floor(diff / 3600) + " hours ago") || day_diff == 1 && "Yesterday" || day_diff < 7 && day_diff + " days ago" || day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
}

async function LoadPropertiesBlock() {
    const DataForm = document.getElementById("dataform")

    const Indexes = {}
    for (const PropertyKey in InstanceProperties) {
        const Property = InstanceProperties[PropertyKey]
        Property.Key = PropertyKey
        Indexes[Property.Index] = Property
    }

    for (const PropertyIndex of Object.keys(Indexes).sort()) {
        const Property = Indexes[PropertyIndex]
        const PropertyKey = Property.Key
        const PropertyElementId = `InstanceDataForm_${PropertyKey}`

        const Label = document.createElement("label")
        Label.setAttribute("for", PropertyElementId)
        Label.innerText = Property.Label
        DataForm.appendChild(Label)

        if (false) {
        } else if (Property.Type == "number") {
            const Number = document.createElement("input")
            Number.setAttribute("type", "number")
            Number.setAttribute("id", PropertyElementId)
            Number.setAttribute("name", PropertyKey)
            Number.setAttribute("min", Property.Clamp.Min)
            Number.setAttribute("max", Property.Clamp.Max)
            Number.setAttribute("value", Property.Default)
            Number.setAttribute("placeholder", Property.Default)
            Number.addEventListener(
                "change",
                async function() {
                    if (Number.value == "") {
                        Number.value = Property.Default
                    }
                }
            )
            DataForm.appendChild(Number)
        } else if (Property.Type == "string") {
            const String = document.createElement("input")
            String.setAttribute("type", "string")
            String.setAttribute("id", PropertyElementId)
            String.setAttribute("name", PropertyKey)
            String.setAttribute("value", Property.Default)
            String.setAttribute("placeholder", Property.Default)
            String.addEventListener(
                "change",
                async function() {
                    if (String.value == "") {
                        String.value = Property.Default
                    }
                }
            )
            DataForm.appendChild(String)
        } else if (Property.Type == "boolean") {
            
        } else if (Property.Type == "table") {
            const Select = document.createElement("select")
            Select.setAttribute("id", PropertyElementId)
            Select.setAttribute("name", PropertyKey)
            for (const SelectOption of Property.Values) {
                const Option = document.createElement("option")
                Option.setAttribute("value", SelectOption)
                Option.innerText = SelectOption
                Select.appendChild(Option)
            }
            DataForm.appendChild(Select)
        }
        const Br = document.createElement("br")
        DataForm.appendChild(Br)
    }
}

async function ReloadInstancesList(SelectedId) {
    const Instances = await CoreLauncher.IPC.Send("Main", "Games.Instances.GetInstances", Game.Id)
    async function HideBlocks(Visibility) {
        for (const Block of OnEditBlocks) {
            if (Visibility) {
                Block.style.visibility = ""
            } else {
                Block.style.visibility = "hidden"
            }
        }
    }

    HideBlocks(false)
    const InstancesHolder = document.getElementById("instancesholder")
    InstancesHolder.innerHTML = ""
    SelectedInstance = null
    for (const Instance of Instances) {
        const InstanceElement = InstanceTemplate.cloneNode(true)
        InstanceElement.querySelector("#instancelabel").innerText = Instance.Name
        InstanceElement.querySelector("#instanceversion").innerText = Instance.Comment
        InstanceElement.addEventListener(
            "click",
            async function() {
                if (Instance.Editable == false) {return}
                if (InstanceElement.classList.contains("selectedinstance")) {
                    InstanceElement.classList.remove("selectedinstance")
                    SelectedInstance = null
                    HideBlocks(false)
                    return
                }
                HideBlocks(true)
                for (const InstanceBlock of Array.from(InstancesHolder.childNodes)) {
                    InstanceBlock.classList.remove("selectedinstance")
                }
                SelectedInstance = Instance
                OnInstanceChange()
                InstanceElement.classList.add("selectedinstance")
                for (const PropertyKey in Instance.Properties) {
                    const PropertyValue = Instance.Properties[PropertyKey]
                    const FieldElement = document.getElementById(`InstanceDataForm_${PropertyKey}`)
                    const FieldElementType = FieldElement.nodeName
                    if (FieldElementType == "INPUT") {
                        FieldElement.setAttribute("value", PropertyValue)
                    } else if (FieldElementType == "SELECT") {
                        Array.from(FieldElement.options).find(function(S) {return S.innerText == PropertyValue}).selected = true
                    }
                }
            }
        )
        InstancesHolder.appendChild(InstanceElement)
        if (Instance.Id == SelectedId) {
            InstanceElement.click()
        }
    }
}

async function LoadButtonCallbacks() {
    document.getElementById("newinstancebutton").addEventListener(
        "click",
        async function() {
            const NewId = await CoreLauncher.IPC.Send(
                "Main",
                "Games.Instances.NewInstance",
                Game.Id
            )
            await ReloadInstancesList(NewId)
        }
    )

    document.getElementById("deleteinstancebutton").addEventListener(
        "click",
        async function() {
            await CoreLauncher.IPC.Send(
                "Main",
                "Games.Instances.DeleteInstance",
                {
                    Game: Game.Id,
                    Id: SelectedInstance.Id
                }
            )
            await ReloadInstancesList()
        }
    )

    document.getElementById("saveinstancebutton").addEventListener(
        "click",
        async function() {
            const Properties = {}
            for (const PropertyKey in InstanceProperties) {
                const Property = InstanceProperties[PropertyKey]
                const PropertyElement = document.getElementById(`InstanceDataForm_${PropertyKey}`)
                const PropertyElementType = PropertyElement.nodeName
                if (PropertyElementType == "INPUT") {
                    Properties[PropertyKey] = PropertyElement.value
                } else if (PropertyElementType == "SELECT") {
                    Properties[PropertyKey] = PropertyElement.selectedOptions[0].value
                }
            }
            await CoreLauncher.IPC.Send(
                "Main",
                "Games.Instances.SetProperties",
                {
                    Game: Game.Id,
                    Id: SelectedInstance.Id,
                    Properties: Properties
                }
            )
            await ReloadInstancesList()
        }
    )
}

async function LoadModSources() {
    const SourcesSelect = document.getElementById("modsource")
    const Sources = await CoreLauncher.IPC.Send(
        "Main",
        "Games.Instances.Modifications.GetModSources",
        Game.Id
    )
    p(Sources)
    for (const ModSource of Sources) {
        const Option = document.createElement("option")
        Option.value = ModSource
        Option.innerText = ModSource
        SourcesSelect.appendChild(Option)
    }
}

async function LoadSearchBar() {
    const ResultHolder = document.getElementById("resultholder")
    const SearchBar = document.getElementById("modsearchbar")
    const PageBar = document.getElementById("pageinput")
    async function OnChange() {
        const SearchResponse = await CoreLauncher.IPC.Send(
            "Main",
            "Games.Instances.Modifications.Search",
            {
                Game: Game.Id,
                Source: "Modrinth",
                Query: SearchBar.value,
                SearchProperties: {},
                Instance: SelectedInstance,
                Page: PageBar.value
            }
        )
        p(SearchResponse)
        PageBar.max = SearchResponse.PageCount
        document.getElementById("pagescount").innerText = `/${SearchResponse.PageCount} pages`
        ResultHolder.innerHTML = ""
        for (const Mod of SearchResponse.Hits) {
            const ModElement = ModTemplate.cloneNode(true)
            ModElement.querySelector("#modimage").src = Mod.Icon
            ModElement.querySelector("#modname").innerText = Mod.Name
            ModElement.querySelector("#modauthor").innerText = `by ${Mod.Author}`
            ModElement.querySelector("#moddesc").innerText = Mod.Description
            ModElement.querySelector("#modcategories").innerText = Mod.Categories.join(", ")
            ModElement.querySelector("#viewbrowserbutton").addEventListener(
                "click",
                async function() {
                    CoreLauncher.IPC.Send(
                        "Main",
                        "Other.ExtLink",
                        Mod.Link
                    )
                }
            )
            ModElement.querySelector("#addinstancebutton").addEventListener(
                "click",
                async function() {
                    p(Mod)
                    await CoreLauncher.IPC.Send(
                        "Main",
                        "Games.Instances.Modifications.AddToInstance",
                        {
                            Game: Game.Id,
                            InstanceId: SelectedInstance.Id,
                            ModData: {
                                Source: Mod.Source,
                                Id: Mod.Id,
                                Version: "latest"
                            }
                        }
                    )
                }
            )
            ResultHolder.appendChild(ModElement)
        }
    }
    SearchBar.addEventListener(
        "change",
        async function() {
            PageBar.value = 1
            OnChange()
        }
    )
    PageBar.addEventListener(
        "change",
        async function() {
            p(PageBar.value)
            if (PageBar.value == "") {
                PageBar.value = 1
            }
            PageBar.value = Number(PageBar.value).clamp(1, PageBar.max)
            OnChange()
        }
    )

    OnInstanceChange = OnChange

    async function ChangeElement(Elm) {
        Elm.dispatchEvent(new Event("change"));
    }
    document.getElementById("prevpage").addEventListener(
        "click",
        async function() {
            PageBar.value = Number(PageBar.value) - 1
            ChangeElement(PageBar)
        }
    )
    document.getElementById("nextpage").addEventListener(
        "click",
        async function() {
            PageBar.value = Number(PageBar.value) + 1
            ChangeElement(PageBar)
        }
    )
}

window.addEventListener(
    "load",
    async function() {
        Game = await CoreLauncher.IPC.Send("Main", "Games.GetGame", QueryParameters.game)
        InstanceProperties = await CoreLauncher.IPC.Send("Main", "Games.Instances.GetInstanceProperties", Game.Id)
        OnEditBlocks = [
            document.getElementById("datablock"),
            document.getElementById("enabledmodsblock"),
            document.getElementById("disabledmodsblock"),
            document.getElementById("newmodsblock"),
        ]
        InstanceTemplate = document.getElementById("instance")
        InstanceTemplate.remove()
        ModTemplate = document.getElementById("modresult")
        ModTemplate.remove()

        await LoadPropertiesBlock()
        await ReloadInstancesList()
        await LoadButtonCallbacks()
        await LoadModSources()
        await LoadSearchBar()
    }
)
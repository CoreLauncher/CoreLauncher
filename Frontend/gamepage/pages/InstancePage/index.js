var SelectedInstance = null
var Game
var InstanceProperties
var OnEditBlocks
var InstanceTemplate
var ModTemplate
var ModListTemplate
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
    for (const InstanceId in Instances) {
        const Instance = Instances[InstanceId]
        const InstanceElement = InstanceTemplate.cloneNode(true)
        InstanceElement.querySelector("#instancelabel").innerText = Instance.Name
        InstanceElement.querySelector("#instanceversion").innerText = Instance.Comment + ({[false]: " (Not Editable)"}[Instance.Editable] || "")
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
                await LoadModsList()
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

    document.getElementById("exportinstancebutton").addEventListener(
        "click",
        async function(E) {
            p(E.ctrlKey && E.shiftKey && E.altKey)
            const File = await CoreLauncher.IPC.Send(
                "Main",
                "Games.Instances.Export",
                {
                    Game: Game.Id,
                    InstanceId: SelectedInstance.Id,
                    Server: E.ctrlKey && E.shiftKey && E.altKey
                }
            )
            p(File)
            const Download = document.createElement("a")
            Download.href = File
            Download.download = `${SelectedInstance.Name}.clpack`
            await Download.click()
            Download.remove()
        }
    )

    const Input = document.createElement("input")
    Input.type = "file"
    Input.accept = ".clpack"
    document.getElementById("importinstancebutton").addEventListener(
        "click",
        async function() {
            Input.click()
        }
    )
    Input.addEventListener(
        "change",
        async function() {
            var R = new FileReader()
            R.readAsText(Input.files[0])
            R.onload = async function(File) {
                p(File.type)
                p(File)
                if (File.type != "load") {return}
                await CoreLauncher.IPC.Send(
                    "Main",
                    "Games.Instances.Import",
                    { 
                        Game: Game.Id,
                        File: R.result
                    }
                )
                Input.value = null
                await ReloadInstancesList()
            }
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
    for (const ModSource of Sources) {
        const Option = document.createElement("option")
        Option.value = ModSource
        Option.innerText = ModSource
        SourcesSelect.appendChild(Option)
    }
    SourcesSelect.value = "Modrinth"
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
                Source: document.getElementById("modsource").value,
                Query: SearchBar.value,
                SearchProperties: {},
                Instance: SelectedInstance,
                Page: PageBar.value
            }
        )
        const ExistingMods = await CoreLauncher.IPC.Send(
            "Main",
            "Games.Instances.Modifications.ListMods",
            {
                Game: Game.Id,
                InstanceId: SelectedInstance.Id
            }
        )
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
            const AddButton = ModElement.querySelector("#addinstancebutton")
            let IsRemoveButton = false
            async function SetAddRemoveButton() {
                AddButton.innerText = "Remove mod"
                AddButton.classList.remove("button-positive")
                AddButton.classList.add("button-danger")
                IsRemoveButton = true
            }
            if (ExistingMods[Mod.Id] != null) {
                await SetAddRemoveButton()
            }
            AddButton.addEventListener(
                "click",
                async function() {
                    if (IsRemoveButton == true) {
                        AddButton.innerText = "Add to instance"
                        AddButton.classList.add("button-positive")
                        AddButton.classList.remove("button-danger")
                        IsRemoveButton = false
                        await CoreLauncher.IPC.Send(
                            "Main",
                            "Games.Instances.Modifications.RemoveMod",
                            {
                                Game: Game.Id,
                                InstanceId: SelectedInstance.Id,
                                ModId: Mod.Id
                            }
                        )
                    } else {
                        await CoreLauncher.IPC.Send(
                            "Main",
                            "Games.Instances.Modifications.AddToInstance",
                            {
                                Game: Game.Id,
                                InstanceId: SelectedInstance.Id,
                                ModData: {
                                    Source: Mod.Source,
                                    Id: Mod.Id,
                                    Version: "latest",
                                    Name: Mod.Name,
                                    Icon: Mod.Icon,
                                    Link: Mod.Link
                                }
                            }
                        )
                        await SetAddRemoveButton()
                    }
                    await LoadModsList()
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
            if (PageBar.value == "") {
                PageBar.value = 1
            }
            PageBar.value = Number(PageBar.value).clamp(1, PageBar.max)
            OnChange()
        }
    )
    document.getElementById("modsource").addEventListener(
        "change",
        OnChange
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

async function LoadModsList() {
    const ModsObject = await CoreLauncher.IPC.Send(
        "Main",
        "Games.Instances.Modifications.ListMods",
        {
            Game: Game.Id,
            InstanceId: SelectedInstance.Id
        }
    )
    var Mods = Object.values(ModsObject)
    p(Mods)
    Mods = Mods.sort(
        function(a, b) {
            var textA = a.Name.toUpperCase();
            var textB = b.Name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        }
    )
    document.getElementById("enabledmodlist").innerHTML = ""
    document.getElementById("disabledmodlist").innerHTML = ""
    for (const Mod of Mods) {
        const ModElement = ModListTemplate.cloneNode(true)
        ModElement.querySelector("#modimage").src = Mod.Icon
        ModElement.querySelector("#modname").innerText = Mod.Name
        const ModVersionSelect = ModElement.querySelector("#modversionselect")

        const SelectedOption = document.createElement("option")
        SelectedOption.value = Mod.Version
        SelectedOption.innerText = Mod.VersionName
        ModVersionSelect.appendChild(SelectedOption)
        if (Mod.VersionIsLatest == false) {
            ModElement.querySelector("#warningimage").classList.add("warningenabled")
        }

        let Versions
        ModVersionSelect.addEventListener(
            "click",
            async function() {
                if (Versions) {p("Versions already gotten"); return}
                Versions = await CoreLauncher.IPC.Send(
                    "Main",
                    "Games.Instances.Modifications.GetModVersions",
                    {
                        Game: Game.Id,
                        InstanceId: SelectedInstance.Id,
                        Mod: Mod
                    }
                )
                for (const Version of Versions) {
                    if (Version.Id != Mod.Version) {
                        const Option = document.createElement("option")
                        Option.value = Version.Id
                        Option.innerText = Version.Name
                        ModVersionSelect.appendChild(Option)
                    }
                }
            }
        )

        ModVersionSelect.addEventListener(
            "change",
            async function() {
                var Version
                for (const ItVersion of Versions) {
                    if (ItVersion.Id == ModVersionSelect.value) {
                        Version = ItVersion
                        break
                    }
                }
                await CoreLauncher.IPC.Send(
                    "Main",
                    "Games.Instances.Modifications.SetModVersionId",
                    {
                        Game: Game.Id,
                        InstanceId: SelectedInstance.Id,
                        ModId: Mod.Id,
                        ModData: {
                            VersionId: ModVersionSelect.value,
                            VersionName: Version.Name,
                            Latest: Version.Latest,
                            Url: Version.Url,
                            Hash: Version.Hash
                        }
                    }
                )
                await LoadModsList()
            }
        )
        ModElement.querySelector("#viewinbrowserbutton").addEventListener(
            "click",
            async function() {
                CoreLauncher.IPC.Send(
                    "Main",
                    "Other.ExtLink",
                    Mod.Link
                )
            }
        )
        ModElement.querySelector("#disablemodbutton").addEventListener(
            "click",
            async function() {
                await CoreLauncher.IPC.Send(
                    "Main",
                    "Games.Instances.Modifications.SetModState",
                    {
                        Game: Game.Id,
                        InstanceId: SelectedInstance.Id,
                        ModId: Mod.Id,
                        State: !Mod.Enabled
                    }
                )
                await LoadModsList()
            }
        )
        ModElement.querySelector("#removemodbutton").addEventListener(
            "click",
            async function() {
                await CoreLauncher.IPC.Send(
                    "Main",
                    "Games.Instances.Modifications.RemoveMod",
                    {
                        Game: Game.Id,
                        InstanceId: SelectedInstance.Id,
                        ModId: Mod.Id
                    }
                )
                await LoadModsList()
                await OnInstanceChange()
            }
        )
        if (Mod.Enabled == true) {
            document.getElementById("enabledmodlist").appendChild(ModElement)
        } else {
            document.getElementById("disabledmodlist").appendChild(ModElement)
        }
    }
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
        ModListTemplate = document.getElementById("modtemplate")
        ModListTemplate.remove()

        await LoadPropertiesBlock()
        await ReloadInstancesList()
        await LoadButtonCallbacks()
        await LoadModSources()
        await LoadSearchBar()
    }
)
var GameId
var InstanceId

window.addEventListener(
    "load",
    async function() {
        GameId = QueryParameters.gameid
        InstanceId = QueryParameters.instanceid
    }
)

async function GetInstance() {
    return await CoreLauncher.IPC.Send(
        "Main",
        "Games.Instances.GetInstance",
        {
            GameId: GameId,
            InstanceId: InstanceId
        }
    )
}

async function SetProperty(PropertyType, PropertyKey, PropertyValue) {
    await CoreLauncher.IPC.Send(
        "Main",
        "Games.Instances.SetProperty",
        {
            GameId: GameId,
            InstanceId: InstanceId,
            PropertyType: PropertyType,
            PropertyKey: PropertyKey,
            PropertyValue: PropertyValue
        }
    )
}

//#region Name and versions
window.addEventListener(
    "load",
    async function() {
        const Instance = await GetInstance()
        p(Instance)

        document.getElementById("instancename").value = Instance.Name
        document.getElementById("instancename").addEventListener(
            "change",
            async function() {
                await SetProperty("Name", "", document.getElementById("instancename").value)
            }
        )

        document.getElementById("instanceloadertype").value = Instance.DefaultProperties.LoaderType
        document.getElementById("instancegameversion").value = Instance.DefaultProperties.GameVersion

        const LoaderVersions = await CoreLauncher.IPC.Send(
            "Main",
            "Games.Instances.GetVersions",
            {
                GameId: GameId,
                Type: "LoaderVersions",
                Value: {
                    Loader: Instance.DefaultProperties.LoaderType,
                    GameVersion: Instance.DefaultProperties.GameVersion
                }
            }
        )

        const LoaderVersionSelect = document.getElementById("instanceloaderversion")
        LoaderVersionSelect.innerHTML = ""
        for (const Version of LoaderVersions) {
            const Option = document.createElement("option")
            Option.value = Version.Name
            Option.innerText = Version.Name
            LoaderVersionSelect.appendChild(Option)
        }

        LoaderVersionSelect.value = Instance.DefaultProperties.LoaderVersion

        LoaderVersionSelect.addEventListener(
            "change",
            async function() {
                await SetProperty("DefaultProperties", "LoaderVersion", LoaderVersionSelect.value)
            }
        )
    }
)
//#endregion
//#region Properties
window.addEventListener(
    "load",
    async function() {
        const Instance = await GetInstance()
        const Properties = await CoreLauncher.IPC.Send(
            "Main",
            "Games.Instances.GetAvailableProperties",
            {
                GameId: GameId,
            }
        )

        p(Properties)

        const PropertyHolder = document.getElementById("properties")
        for (const PropertyKey in Properties) {
            const Property = Properties[PropertyKey]
            p(Property)

            const ElementId = `InstanceProperty_${PropertyKey}`
            var Input
            if (Property.Type == "number") {
                const Label = document.createElement("label")
                Label.for = ElementId
                Label.innerText = `${Property.Label}: `
                PropertyHolder.appendChild(Label)
                Input = document.createElement("input")
                Input.type = "number"
                Input.id = ElementId
                Input.max = Property.Clamp.Max
                Input.min = Property.Clamp.Min
                Input.step = .5
                Input.value = Instance.Properties[PropertyKey]
                PropertyHolder.appendChild(Input)
            }

            Input.addEventListener(
                "change",
                async function() {
                    p(Input.value)
                    if (Input.value == "" || !Input.value) {
                        Input.value = Property.Default
                    }
                    await SetProperty("Properties", PropertyKey, Input.value)
                }
            )
        }
    }
)
//#endregion
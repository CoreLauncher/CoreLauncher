var VersionTemplate

async function LoadSelector(Id, Type, Value, Change) {
    const Selector = document.getElementById(Id)
    Selector.innerHTML = ""

    const Versions = await CoreLauncher.IPC.Send(
        "Main",
        "Games.Instances.GetVersions",
        {
            GameId: QueryParameters.gameid,
            Type: Type,
            Value: Value
        }
    )
    for (const Version of Versions) {
        var Create = false
        if (document.getElementById("showbeta").checked == true) {
            Create = true
        } else {
            if (Version.Beta == false) {
                Create = true
            }
        }

        if (Create == true) {
            const VersionElement = VersionTemplate.cloneNode(true)
            VersionElement.querySelector(".versionlabel").innerText = Version.Name
            VersionElement.addEventListener(
                "click",
                async function() {
                    Selector.childNodes.forEach(
                        function(Element) {
                            Element.classList.remove("selectedversion")
                        }
                    )
                    VersionElement.classList.add("selectedversion")
                    Change(Version.Id)
                }
            )
            Selector.appendChild(VersionElement)
        }
    }
}

window.addEventListener(
    "load",
    async function() {
        VersionTemplate = document.getElementById("versiontemplate")
        VersionTemplate.remove()

        const Values = {}
        var CanCreate = false

        async function StateChange() {
            const CreateButton = document.getElementById("createbutton")
            p("StateChange")
            if (!Values.LoaderType || !Values.GameVersion || !Values.LoaderVersion || !Values.Name) {
                CreateButton.classList.add("button-danger")
                CreateButton.classList.remove("button-positive")
                CanCreate = false
                return
            }
            CreateButton.classList.add("button-positive")
            CreateButton.classList.remove("button-danger")
            CanCreate = true
        }
        async function LoadSelectors() {
            await LoadSelector(
                "loadertype",
                "LoaderTypes",
                null,
                async function(Value) {
                    Values.LoaderType = Value
                    document.getElementById("gameversion").innerHTML = ""
                    document.getElementById("loaderversion").innerHTML = ""
                    await StateChange()
                    await LoadSelector(
                        "gameversion",
                        "GameVersions",
                        Value,
                        async function(Value) {
                            Values.GameVersion = Value.GameVersion
                            await StateChange()
                            await LoadSelector(
                                "loaderversion",
                                "LoaderVersions",
                                Value,
                                async function(Value) {
                                    Values.LoaderVersion = Value
                                    await StateChange()
                                    p(Values)
                                }
                            )
                        }
                    )
                }
            )
        }
        await LoadSelectors()

        document.getElementById("showbeta").addEventListener(
            "change",
            async function() {
                LoadSelectors()
                document.getElementById("gameversion").innerHTML = ""
                document.getElementById("loaderversion").innerHTML = ""
                Values.LoaderType = null
                Values.GameVersion = null
                Values.LoaderVersion = null
            }
        )
        document.getElementById("instancename").addEventListener(
            "change",
            async function() {
                Values.Name = document.getElementById("instancename").value
                await StateChange()
            }
        )
        document.getElementById("createbutton").addEventListener(
            "click",
            async function() {
                if (CanCreate == false) {
                    return
                }

                await CoreLauncher.IPC.Send(
                    "Main",
                    "Games.Instances.CreateInstance",
                    {
                        GameId: QueryParameters.gameid,
                        Data: Values
                    }
                )

                CoreLauncher.API.NotificationService.Close()
            }
        )
    }
)
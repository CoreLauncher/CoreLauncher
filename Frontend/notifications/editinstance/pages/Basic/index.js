window.addEventListener(
    "load",
    async function() {
        const Instance = await CoreLauncher.IPC.Send(
            "Main",
            "Games.Instances.GetInstance",
            {
                GameId: QueryParameters.gameid,
                InstanceId: QueryParameters.instanceid
            }
        )
        p(Instance)

        document.getElementById("instancename").value = Instance.Name
        document.getElementById("instancename").addEventListener(
            "change",
            async function() {
                await CoreLauncher.IPC.Send(
                    "Main",
                    "Games.Instances.SetProperty",
                    {
                        GameId: QueryParameters.gameid,
                        InstanceId: QueryParameters.instanceid,
                        PropertyType: "Name",
                        PropertyKey: "",
                        PropertyValue: document.getElementById("instancename").value
                    }
                )
            }
        )

        document.getElementById("instanceloadertype").value = Instance.DefaultProperties.LoaderType
        document.getElementById("instancegameversion").value = Instance.DefaultProperties.GameVersion

        const LoaderVersions = await CoreLauncher.IPC.Send(
            "Main",
            "Games.Instances.GetVersions",
            {
                GameId: QueryParameters.gameid,
                Type: "LoaderVersions",
                Value: {
                    Loader: Instance.DefaultProperties.LoaderType,
                    GameVersion: Instance.DefaultProperties.GameVersion
                }
            }
        )

        p(LoaderVersions)

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
                await CoreLauncher.IPC.Send(
                    "Main",
                    "Games.Instances.SetProperty",
                    {
                        GameId: QueryParameters.gameid,
                        InstanceId: QueryParameters.instanceid,
                        PropertyType: "DefaultProperties",
                        PropertyKey: "LoaderVersion",
                        PropertyValue: LoaderVersionSelect.value
                    }
                )
            }
        )
    }
)
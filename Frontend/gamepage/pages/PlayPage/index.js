window.addEventListener(
    "load",
    async function() {
        const PlayBar = document.getElementById("playbar")
        const BarFiller = document.getElementById("barfiller")
        const StageText = document.getElementById("stagetext")
        const ProgressText = document.getElementById("progresstext")
        CoreLauncher.IPC.RegisterMessage(
            "ProgressBar.Update",
            async function(Data) {
                p(Data)
                BarFiller.style.width = `${Data.Percent}%`
                StageText.innerText = Data.Stage
                ProgressText.innerText = `${Data.Count}/${Data.Total} (${Math.floor(Data.Percent)}%)`
            }
        )

        const Game = await CoreLauncher.IPC.Send(
            "Main",
            "Games.GetGame",
            QueryParameters.game
        )
        document.getElementById("bannerimage").src = Game.Banner

        const Instances = await CoreLauncher.IPC.Send(
            "Main",
            "Games.Instances.GetInstances", 
            Game.Id
        )
        p(Instances)
        const CurrentInstance = document.getElementById("currentinstance")
        for (const InstanceID in Instances) {
            const Instance = Instances[InstanceID]

            const Option = document.createElement("option")
            Option.value = Instance.Id 
            Option.innerText = `${Instance.Name} (${Instance.Comment})`
            CurrentInstance.appendChild(Option)
        }

        const PlayButton = document.getElementById("playbutton")
        PlayButton.addEventListener(
            "click",
            async function() {
                p(CurrentInstance.value)
                const ReturnData = await CoreLauncher.IPC.Send(
                    "Main",
                    "Games.LaunchGame", 
                    {
                        Game: Game.Id,
                        InstanceId: CurrentInstance.value
                    }
                )
                p("Sent")
            }
        )
    }
)
var Game
var Instances 
var PlayButton

var CanClick = true
var ButtonKillsGame = false
var UpdateButton = true

async function GetGameState() {
    if (UpdateButton == true) {
        const State = await CoreLauncher.IPC.Send(
            "Main",
            "Games.GetState"
        )
        if (State.Running) {
            PlayButton.classList.remove("button-positive")
            PlayButton.classList.add("button-danger")
            p("Running")
            PlayButton.innerText = "Kill Game"
        } else {
            PlayButton.classList.add("button-positive")
            PlayButton.classList.remove("button-danger")
            PlayButton.innerText = "Play"
        }
        ButtonKillsGame = State.Running
    }
}

async function LoadProgressBar() {
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
            if (Data.Shown == true) {
                PlayBar.classList.add("loadingbarvisible")
            } else {
                PlayBar.classList.remove("loadingbarvisible")
            }
        }
    )
}

async function LoadInstanceDropdown() {
    p(Instances)
    const CurrentInstance = document.getElementById("currentinstance")
    for (const InstanceID in Instances) {
        const Instance = Instances[InstanceID]

        const Option = document.createElement("option")
        Option.value = Instance.Id 
        Option.innerText = `${Instance.Name} (${Instance.Comment})`
        CurrentInstance.appendChild(Option)
    }
}

async function LoadPlayButton() {
    await GetGameState()
    const CurrentInstance = document.getElementById("currentinstance")
    PlayButton.addEventListener(
        "click",
        async function() {
            if (CanClick == false) {
                return
            }
            if (ButtonKillsGame == true) {
                const ReturnData = await CoreLauncher.IPC.Send(
                    "Main",
                    "Games.KillGame", 
                    {
                        Game: Game.Id,
                        InstanceId: CurrentInstance.value
                    }
                )
            } else {
                CanClick = false
                UpdateButton = false
                const ReturnData = await CoreLauncher.IPC.Send(
                    "Main",
                    "Games.LaunchGame", 
                    {
                        Game: Game.Id,
                        InstanceId: CurrentInstance.value
                    }
                )
                await GetGameState()
                UpdateButton = true
                CanClick = true
            }
        }
    )
}


window.addEventListener(
    "load",
    async function() {
        Game = await CoreLauncher.IPC.Send(
            "Main",
            "Games.GetGame",
            QueryParameters.game
        )
        Instances = await CoreLauncher.IPC.Send(
            "Main",
            "Games.Instances.GetInstances", 
            Game.Id
        )
        PlayButton = document.getElementById("playbutton")
        await LoadProgressBar()
        document.getElementById("bannerimage").src = Game.Banner
        await LoadInstanceDropdown()
        await LoadPlayButton()

        while (true) {
            await Sleep(1000)
            const GameState = await GetGameState()
        }
    }
)
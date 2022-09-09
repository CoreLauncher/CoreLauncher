window.addEventListener(
    "load",
    async function() {
        const Game = await CoreLauncher.IPC.Send(
            "Main",
            "Games.GetGame",
            QueryParameters.game
        )
        console.log(Game)
        document.getElementById("bannerimage").src = Game.Banner
    }
)
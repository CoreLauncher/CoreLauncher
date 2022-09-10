window.addEventListener(
    "load",
    async function() {
        const Game = await CoreLauncher.IPC.Send(
            "Main",
            "Games.GetGame",
            QueryParameters.game
        )
        document.getElementById("bannerimage").src = Game.Banner
    }
)
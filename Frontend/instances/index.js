window.addEventListener(
    "load",
    async function() {
        const urlSearchParams = new URLSearchParams(window.location.search); const QueryParameters = Object.fromEntries(urlSearchParams.entries());
        const GameId = QueryParameters["game"];
        console.log(GameId)
        const Game = await CoreLauncher.IPC.Send(
            "Main",
            "GetGame",
            GameId
        )
        console.log(Game)
    }
)
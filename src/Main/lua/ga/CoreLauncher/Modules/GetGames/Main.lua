CoreLauncher.IPC:RegisterMessage(
    "GetGames",
    function()
        local Games = {}
        for _, Game in pairs(CoreLauncher.Games) do
            table.insert(
                Games,
                Game.Info
            )
        end
        return Games
    end
)

CoreLauncher.IPC:RegisterMessage(
    "GetGame",
    function(GameId)
        return CoreLauncher.Games[GameId].Info
    end
)
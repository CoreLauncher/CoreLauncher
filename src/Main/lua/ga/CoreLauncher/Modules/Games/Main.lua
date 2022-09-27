Import("ga.CoreLauncher.Modules.Games.Instances")

CoreLauncher.IPC:RegisterMessage(
    "Games.GetGames",
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
    "Games.GetGame",
    function(GameId)
        return CoreLauncher.Games[GameId].Info
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.LaunchGame",
    function(Data)
        local Game = Data.Game
        local InstanceId = Data.InstanceId
        local Instance = CoreLauncher.Config:GetKey(
            string.format(
                "Games.%s.Instances.%s",
                Game,
                InstanceId
            )
        )
        p(Instance)
        CoreLauncher.Games[Game].Functions.LaunchGame(Instance)
    end
)
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

local function GetInstances(Game)
    local Instances = CoreLauncher.Config:GetKey(
        string.format(
            "Games.%s.Instances",
            Game
        )
    )
    if Instances == nil then
        Instances = {}
        CoreLauncher.Config:SetKey(
            string.format(
                "Games.%s.Instances",
                Game
            ),
            {}
        )
    end
    Instances = table.deepcopy(Instances)
    local Default = CoreLauncher.Games[Game].Functions.GetDefaultInstances()
    for Index, Instance in pairs(Default) do
        Instances[Instance.Id] = Instance
    end
    for Index, Instance in pairs(Instances) do
        Instance.Comment = CoreLauncher.Games[Game].Functions.GetInstanceComment(Instance)
        Instance.Properties.InstanceName = Instance.Name
    end
    return Instances
end

CoreLauncher.IPC:RegisterMessage(
    "Games.LaunchGame",
    function(Data)
        local Game = Data.Game
        local InstanceId = Data.InstanceId
        local Instance = GetInstances(Game)[InstanceId]
        CoreLauncher.Games[Game].Functions.LaunchGame(Instance)
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.KillGame",
    function(Data)
        if CoreLauncher.Game.Process ~= nil then
            require("uv").process_kill(CoreLauncher.Game.Process.handle)
            TypeWriter.Logger.Info("Killed game")
        end
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.GetState",
    function()
        return {
            Running = CoreLauncher.Game.IsRunning,
            GameId = CoreLauncher.Game.RunningId
        }
    end
)
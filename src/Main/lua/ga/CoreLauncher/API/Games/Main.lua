local Games = {}

function Games.List()
    local ReturnData = {}
    for GameId, Game in pairs(CoreLauncher.Games) do
        ReturnData[GameId] = Game
    end
    return ReturnData
end

function Games.ListInfo()
    local ReturnData = {}
    local Games = Games.List()
    for _, Game in pairs(Games) do
        Game = table.deepcopy(Game)
        ReturnData[Game.Id] = Game.Info
    end
    return ReturnData
end

return Games
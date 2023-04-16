local GameManager = {}
GameManager.Games = {}

local Base64Img = TypeWriter:JsRequire("base64-img")
local FS = TypeWriter:JsRequire("fs-extra")

function GameManager:LoadGames(Games)
    self.Games = Games
end

function GameManager:ListGames()
    return self.Games
end

function GameManager:GetGame(GameId)
    return self:ListGames()[GameId]
end

function GameManager:GetGameIcon(GameId)
    local IconPath = TypeWriter.ResourceManager:GetFilePath(self:GetGame(GameId).Icon)
    return FS:readFileSync(IconPath, "utf8")
end

function GameManager:GetGameIconBase64(GameId)
    local IconPath = TypeWriter.ResourceManager:GetFilePath(self:GetGame(GameId).Icon)
    return Base64Img:base64Sync(IconPath)
end

return GameManager
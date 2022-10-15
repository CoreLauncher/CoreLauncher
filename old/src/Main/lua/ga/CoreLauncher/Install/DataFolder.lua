local FS = require("fs")
return function ()
    local GamesFolder = CoreLauncher.ApplicationData .. "/Games/"
    FS.mkdirSync(GamesFolder)
    for GameId, GameData in pairs(CoreLauncher.Games) do
        FS.mkdirSync(GamesFolder .. GameId)
    end
end
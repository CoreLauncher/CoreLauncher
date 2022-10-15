local All = {
    Import("ga.CoreLauncher.Games.Minecraft")
}

local Games = {}
for Index, Game in pairs(All) do
    Games[Game.Info.Id] = Game
end
return Games
local List = {
    Import("ga.CoreLauncher.Games.Minecraft")
}
local Games = {}

for _, Game in pairs(List) do
    Games[Game.Id] = Game
end

return Games
local Discord = {}

local Json = require("json")
local Request = require("coro-http").request
local TablePatcher = Import("ga.CoreLauncher.Libraries.TablePatcher")

function Discord.GetUser()
    local Token = CoreLauncher.Config:GetKey("Accounts.Discord.AccessToken.access_token")
    if Token == nil then
        return nil
    end
    local Response, Body = Request(
        "GET",
        "https://discordapp.com/api/users/@me",
        {
            {"Authorization", "Bearer " .. Token},
            {"User-Agent", "CoreLauncher"},
            {"Content-Type", "application/json"}
        }
    )
    return TablePatcher(Json.decode(Body))
end

return Discord
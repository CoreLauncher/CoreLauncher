local Discord = {}

local Json = require("json")
local TablePatcher = Import("ga.CoreLauncher.Libraries.TablePatcher")

function Discord.GetUser()
    local Token = CoreLauncher.Config:GetKey("Accounts.Discord.AccessToken.access_token")
    if Token == nil then
        return nil
    end
    local Response, Body = CoreLauncher.Http.JsonRequest(
        "GET",
        "https://discordapp.com/api/users/@me",
        {
            {"Authorization", "Bearer " .. Token},
            {"Content-Type", "application/json"}
        }
    )
    return TablePatcher(Body)
end

return Discord
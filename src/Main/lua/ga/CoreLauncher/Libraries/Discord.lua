local Discord = {}

local Json = require("json")
local Request = require("coro-http").request
local TablePatcher = Import("ga.CoreLauncher.Libraries.TablePatcher")

function Discord.GetUser(Override)
    local function GetEpoch()
        return os.time()
    end
    local function SetUserData(UserData)
        UserData.CachedAt = GetEpoch()
        CoreLauncher.Config:SetKey(
            "Accounts.Discord.UserData",
            UserData
        )
    end
    local function Get(Key)
        local Response, Body = Request(
            "GET",
            "https://discordapp.com/api/users/@me",
            {
                {"Authorization", "Bearer " .. Override},
                {"User-Agent", "CoreLauncher"},
                {"Content-Type", "application/json"}
            }
        )
        return TablePatcher(Json.decode(Body))
    end
    if type(Override) == "string" then
        local UserData = Get(Override)
        SetUserData(UserData)
        return UserData
    else
        local UserData = Get(CoreLauncher.Config:GetKey("Accounts.Discord.TokenData.access_token"))
        SetUserData(UserData)
        return UserData
    end
    local CachedData = CoreLauncher.Config:GetKey("Accounts.Discord.UserData")
    p(CachedData)

end

return Discord
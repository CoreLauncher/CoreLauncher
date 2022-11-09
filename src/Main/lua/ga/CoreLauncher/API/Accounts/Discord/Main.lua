local Discord = {}

local Cache
function Discord.GetUser()
    local UserData
    if Cache then
        p(Cache)
        UserData = Cache
    else
        local AccountData = CoreLauncher.Accounts:GetAccount("Discord")
        if AccountData == nil then
            return
        end
        local Response, Body = CoreLauncher.Http.JsonRequest(
            "GET",
            "https://discordapp.com/api/users/@me",
            {
                {
                    "Authorization", string.format(
                        "%s %s",
                        AccountData.TokenType,
                        AccountData.AccessToken
                    )
                }
            }
        )
        Cache = Body
        UserData = Cache
    end
    return UserData
end

function Discord.GetUserIcon()
    local UserData = Discord.GetUser()
    if UserData == nil then
        return
    end
    return string.format(
        "https://cdn.discordapp.com/avatars/%s/%s.png",
        UserData.id,
        UserData.avatar
    )
end

return Discord
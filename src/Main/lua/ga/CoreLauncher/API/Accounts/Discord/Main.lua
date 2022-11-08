local Discord = {}

local Cache
function Discord.GetUser()
    local UserData
    if Cache then
        UserData = Cache
    else
        local AccountData = CoreLauncher.Accounts:GetAccount("Discord")
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
    
end

return Discord
local Accounts = Object:extend()

local OpenInBrowser = Import("ga.CoreLauncher.Libraries.OpenInBrowser")
local QueryEncode = require("querystring").stringify
local Discord = Import("ga.CoreLauncher.Libraries.Discord")

local AccountTypes = {
    ["Discord"] = {
        ["Name"] = "Discord",
        ["Icon"] = "https://discord.com/assets/2c21aeda16de354ba5334551a883b481.png",
        ["Url"] = {
            Base = "https://discord.com/api/oauth2/authorize?",
            Query = {
                ["client_id"] = "1008708322922352753",
                ["redirect_uri"] = "http://localhost/callback/discord",
                ["response_type"] = "token",
                ["scope"] = "identify email connections guilds guilds.join"
            }
        },
        Callback = function (Data)
            local UserData = Discord.GetUser(Data.access_token)
            CoreLauncher.Config:SetKey(
                "Accounts.Discord",
                {
                    TokenData = Data,
                    UserData = UserData
                }
            )
            return true
        end
    }
}

function Accounts:initialize(Path)
    
end

function Accounts:AccountConnected(Name)
    return CoreLauncher.Config:GetKey("Accounts." .. Name) ~= nil
end

function Accounts:Connect(Name)
    local UrlData = AccountTypes[Name].Url
    local URL = UrlData.Base .. QueryEncode(UrlData.Query)
    OpenInBrowser(URL)
end

function Accounts:AccountCallback(Name, Data)
    local Success = AccountTypes[Name].Callback(Data)
    if Success then
        coroutine.wrap(function ()
            CoreLauncher.IPC:Send("Render", "AccountConnected", Name)
        end)()
    end
end

return Accounts
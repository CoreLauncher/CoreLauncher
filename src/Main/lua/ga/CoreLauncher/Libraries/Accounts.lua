local Accounts = Class:extend()

local OpenInBrowser = Import("ga.CoreLauncher.Libraries.OpenInBrowser")
local QueryEncode = require("querystring").stringify
local Discord = Import("ga.CoreLauncher.Libraries.Discord")

local Json = require("json")
local Request = require("coro-http").request

local AccountTypes = {
    ["Discord"] = {
        ["Name"] = "Discord",
        ["Icon"] = "https://discord.com/assets/2c21aeda16de354ba5334551a883b481.png",
        ["Url"] = {
            Base = "https://discord.com/api/oauth2/authorize?",
            Query = {
                ["client_id"] = "1008708322922352753",
                ["redirect_uri"] = "http://localhost/callback/discord/",
                ["response_type"] = "code",
                ["scope"] = "identify email connections guilds guilds.join"
            }
        },
        Functions = {
            AccessToken = function (self, Code)
                local Response, Body = Request(
                    "GET",
                    string.format(
                        "%s/discord/token/?code=%s",
                        self.Url,
                        Code
                    )
                )
                return ({Json.decode(Body)})[1]
            end,
            RefreshToken = function (self)
                
            end,
            AfterToken = function (self, Data)
                return Data
            end
        }
    },
    ["MSA"] = {
        ["Name"] = "Microsoft Authentication",
        ["Icon"] = "",
        ["Url"] = {
            Base = "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?",
            Query = {
                ["client_id"] = "54e48db0-6129-4320-82a7-3b0156811a91",
                ["response_type"] = "code",
                ["redirect_uri"] = "http://localhost/callback/msa/",
                ["response_mode"] = "query",
                ["scope"] = "XboxLive.signin offline_access"
            }
        },
        Functions = {
            AccessToken = function (self, Code)
                local Response, Body = Request(
                    "GET",
                    string.format(
                        "%s/msa/token/?code=%s",
                        self.Url,
                        Code
                    )
                )
                return ({Json.decode(Body)})[1]
            end,
            RefreshToken = function (self)
                
            end,
            AfterToken = function (self, Data)
                Data.ExpiresAt = os.time() + (Data.AccessToken.expires_in - 60)
                Data.AccessToken.ext_expires_in = nil
                return Data
            end
        }
    }
}

function Accounts:initialize()
    self.Url = ({[true] = "http://localhost:8423", [false] = "https://auth.corelauncher.ga"})[CoreLauncher.Dev]
end

function Accounts:GetAccount(Name)
    return CoreLauncher.Config:GetKey("Accounts." .. Name)
end

function Accounts:IsConnected(Name)
    return self:GetAccount(Name) ~= nil
end

function Accounts:StartFlow(Name)
    local UrlData = AccountTypes[Name].Url
    local URL = UrlData.Base .. QueryEncode(UrlData.Query)
    p(URL)
    OpenInBrowser(URL)
end

function Accounts:EndFlow(Name, Code)
    local TypeFunctions = AccountTypes[Name].Functions
    local AccessToken = TypeFunctions.AccessToken(self, Code)
    local Data = {AccessToken = AccessToken, Type = Name, At = os.time()}
    local AfterData = TypeFunctions.AfterToken(self, Data)
    CoreLauncher.Config:SetKey(
        string.format("Accounts.%s", Name),
        AfterData
    )
    TypeWriter.Logger.Info("Successfully added %s account", Name)
    CoreLauncher.IPC:Send("Render", "Accounts.FlowCompleted", Name)
end

function Accounts:RefreshAccount(Name)
    
end

return Accounts
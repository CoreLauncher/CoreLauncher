local Accounts = Object:extend()

local QueryEncode = require("querystring").stringify

local BaseUrl = ({[true] = "http://localhost:8423", [false] = "https://auth.corelauncher.ga"})[false] -- CoreLauncher.Dev]

local AccountTypes = {
    ["Discord"] = {
        Information = {
            Name = "Discord"
        },
        FlowUrl = {
            Base = "https://discord.com/api/oauth2/authorize?",
            Query = {
                ["client_id"] = "1008708322922352753",
                ["redirect_uri"] = "http://localhost:9874/callbacks/accounts/",
                ["state"] = "Discord",
                ["prompt"] = "none",
                ["response_type"] = "code",
                ["scope"] = "identify email connections guilds guilds.join"
            }
        },
        Tasks = {
            ResolveCode = function (Code)
                local Response, TokenData = CoreLauncher.Http.JsonRequest(
                    "GET",
                    string.format(
                        "%s/discord/token/?code=%s",
                        BaseUrl,
                        Code
                    )
                )
                p(TokenData)
                return TokenData
            end,
            RefreshToken = function (TokenData)
                local Response, TokenData = CoreLauncher.Http.JsonRequest(
                    "GET",
                    string.format(
                        "%s/discord/refresh/?code=%s",
                        BaseUrl,
                        TokenData.RefreshToken
                    )
                )
                return TokenData
            end,
            AfterToken = function (TokenData)
                local ReturnData = {
                    Scope = TokenData.scope,
                    AccessToken = TokenData.access_token,
                    RefreshToken = TokenData.refresh_token,
                    CreatedAt = os.time(),
                    ExpiresAt = TokenData.expires_in + os.time(),
                    TokenType = TokenData.token_type
                }
                local Response, UserData = CoreLauncher.Http.JsonRequest(
                    "GET",
                    "https://discordapp.com/api/users/@me",
                    {
                        {
                            "Authorization", string.format(
                                "%s %s",
                                ReturnData.TokenType,
                                ReturnData.AccessToken
                            )
                        }
                    }
                )
                ReturnData.Id = UserData.id
                return ReturnData
            end
        }
    }
}

function Accounts:initialize()
end

function Accounts:StartFlow(Id)
    local UrlData = AccountTypes[Id].FlowUrl
    local URL = UrlData.Base .. QueryEncode(UrlData.Query)
    CoreLauncher.API.Other.OpenInBrowser(URL)
end

function Accounts:EndFlow(Id, Code)
    local TypeTasks = AccountTypes[Id].Tasks
    local TokenData = TypeTasks.ResolveCode(Code)
    local ResolvedTokenData = TypeTasks.AfterToken(TokenData)
    CoreLauncher.Config:SetKey(
        string.format(
            "Accounts.%s.Connected.%s",
            Id, ResolvedTokenData.Id
        ),
        ResolvedTokenData
    )
    CoreLauncher.Config:SetKey(
        string.format(
            "Accounts.%s.Using",
            Id
        ),
        ResolvedTokenData.Id
    )
    TypeWriter.Logger.Info("Successfully added %s account", Id)
    CoreLauncher.Window:Reload()
end

function Accounts:GetAccounts(Id)
    return CoreLauncher.Config:GetKey(
        "Accounts.%s.Connected",
        Id
    ) or {}
end

function Accounts:GetAccount(Id)
    local UsingAccount = CoreLauncher.Config:GetKey(
        "Accounts.%s.Using",
        Id
    )
    local Account = self:GetAccounts(Id)[UsingAccount]
    return Account
end

function Accounts:Has(Id)
    return self:GetAccount(Id) ~= nil
end

function Accounts:GetAccountTypes()
    local Types = {}
    for AccountType in pairs(AccountTypes) do
        table.insert(Types, AccountType)
    end
    return Types
end

function Accounts:RefreshAll()
    for AccountTypeId, AccountType in pairs(AccountTypes) do
        local TypeTasks = AccountType.Tasks
        for _, Account in pairs(self:GetAccounts(AccountTypeId)) do
            if not (os.time() - Account.CreatedAt < 3600) then
                local TokenData = TypeTasks.RefreshToken(Account)
                local ResolvedTokenData = TypeTasks.AfterToken(TokenData)
                p(ResolvedTokenData)
                if ResolvedTokenData then
                    CoreLauncher.Config:SetKey(
                        string.format(
                            "Accounts.%s.Connected.%s",
                            AccountTypeId, ResolvedTokenData.Id
                        ),
                        ResolvedTokenData
                    )
                    CoreLauncher.Config:SetKey(
                        string.format(
                            "Accounts.%s.Using",
                            AccountTypeId
                        ),
                        ResolvedTokenData.Id
                    )
                    TypeWriter.Logger.Info("Successfully refreshed %s account (%s)", AccountTypeId, ResolvedTokenData.Id)
                else
                    CoreLauncher.Config:SetKey(
                        string.format(
                            "Accounts.%s.Connected.%s",
                            AccountTypeId, Account.Id
                        ),
                        nil
                    )
                    TypeWriter.Logger.Warn("Failed to refresh %s account (%s)", AccountTypeId, Account.Id)
                end
            else
                TypeWriter.Logger.Warn("Failed to refresh %s account (refreshed less than a hour ago)", AccountTypeId)
            end
        end
    end
end

return Accounts
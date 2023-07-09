local GameManager = {}
GameManager.Games = {}

local Base64Img = TypeWriter.JavaScript:Require("base64-img")
local FS = TypeWriter.JavaScript:Require("fs-extra")

local GameManager = Import("ga.corelauncher.Libraries.ClassCreator")(
    "GameManager",
    function(self)

    end,
    {
        LoadGames = function(self, Games)
            self.Games = Games
        end,
        ListGames = function(self)
            return self.Games
        end,
        GetGame = function(self, GameId)
            return self:ListGames()[GameId]
        end,

        --#region Icon getting
        GetGameIcon = function(self, GameId)
            local IconPath = TypeWriter.ResourceManager:GetFilePath(self:GetGame(GameId).Icon)
            return FS:readFileSync(IconPath, "utf8")
        end,
        GetGameIconBase64 = function(self, GameId)
            local IconPath = TypeWriter.ResourceManager:GetFilePath(self:GetGame(GameId).Icon)
            return Base64Img:base64Sync(IconPath)
        end,
        --#endregion

        --#region Banner getting
        GetGameBanner = function(self, GameId)
            local BannerPath = TypeWriter.ResourceManager:GetFilePath(self:GetGame(GameId).Banner)
            return FS:readFileSync(BannerPath, "utf8")
        end,
        GetGameBannerBase64 = function(self, GameId)
            local BannerPath = TypeWriter.ResourceManager:GetFilePath(self:GetGame(GameId).Banner)
            return Base64Img:base64Sync(BannerPath)
        end,
        --#endregion

        GetValidAccounts = function(self, GameId)
            local Accounts = CoreLauncher.AccountManager:ListAccounts()
            local ValidAccounts = {}
            for _, Account in ipairs(Accounts) do
                local IsAccountValid = self:GetGame(GameId).IsAccountValid(Account)
                if IsAccountValid then
                    table.insert(ValidAccounts, Account)
                end
            end
            return ValidAccounts
        end,

        ListInstanceVersions = function(self, GameId)
            return self:GetGame(GameId).InstanceVersions
        end,

        ListInstanceVersionValues = function(self, GameId, InstanceVersionId, PriorValues)
            local InstanceVersions = self:GetGame(GameId).InstanceVersions
            local InstanceVersion
            for _, Version in pairs(InstanceVersions) do
                if Version.Id == InstanceVersionId then
                    InstanceVersion = Version
                    break
                end
            end
            for Key, Value in pairs(PriorValues) do
                if Value == "undefined" then
                    PriorValues[Key] = nil
                end
            end
            local ObtainedValues = InstanceVersion.ObtainValues(PriorValues)
            Inspect(ObtainedValues)
            return ObtainedValues
        end
    }
)

return GameManager
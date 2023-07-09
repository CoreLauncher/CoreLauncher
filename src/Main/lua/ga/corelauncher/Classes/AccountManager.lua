local Base64Img = TypeWriter.JavaScript:Require("base64-img")
local UUID = TypeWriter.JavaScript:Require("uuid").v4

local AccountManager = Import("ga.corelauncher.Libraries.ClassCreator")(
    "AccountManager",
    function (self)
        self.AccountTypes = {}
        self.Accounts = {}
    end,
    {
        LoadAccountTypes = function (self, AccountTypes)
            self.AccountTypes = AccountTypes
        end,

        LoadAccounts = function (self, AccountList)
            
        end,

        GetAccountTypeInfo = function (self, AccountType)
            local AccountTypeData = self.AccountTypes[AccountType]
            return {
                Id = AccountTypeData.Id,
                Name = AccountTypeData.Name
            }
        end,

        ListAccountTypes = function (self)
            local AccountTypes = {}
            for _, AccountType in pairs(self.AccountTypes) do
                AccountTypes[AccountType.Id] = self:GetAccountTypeInfo(AccountType.Id)
            end
            return AccountTypes
        end,

        StartConnection = function (self, Type)
            self.AccountTypes[Type].StartConnection()
        end,

        FinishedConnection = function (self, Type, Data)
            TypeWriter.Logger:Information("Scope finished for " .. Type .. " account type")

            if self.AccountTypes[Type].FinishedConnection ~= nil then
                self.AccountTypes[Type].FinishedConnection(Data)
            else
                TypeWriter.Logger:Warning("No callback for " .. Type .. " account type")
            end
        end,

        SaveAccountData = function (self, Type, TokenData, DisplayData)
            TypeWriter.Logger:Information("Saving account data for " .. Type .. " account type")
            local AccountData = {
                Type = Type,
                ConnectedAt = os.time(os.date("!*t")),
                TokenData = TokenData,
                DisplayData = DisplayData,
                UUID = UUID()
            }
            CoreLauncher.DataBase:SetKey("Accounts." .. AccountData.UUID, ToJs(AccountData))
        end,

        RemoveAccount = function (self, UUID)
            CoreLauncher.DataBase:SetKey("Accounts." .. UUID, nil)
        end,

        ListAccounts = function (self)
            local AccountsObject = CoreLauncher.DataBase:GetKey("Accounts")
            if AccountsObject == nil then
                return {}
            end
            local Accounts = {}
            for _, AccountData in pairs(AccountsObject) do
                table.insert(Accounts, AccountData)
            end
            return Accounts
        end,

        --#region Icons getting
        GetAccountTypeIcon = function (self, AccountTypeId)
            local IconPath = TypeWriter.ResourceManager:GetFilePath(self.AccountTypes[AccountTypeId].Icon)
            return FS:readFileSync(IconPath, "utf8")
        end,
        
        GetAccountTypeIconBase64 = function (self, AccountTypeId)
            local IconPath = TypeWriter.ResourceManager:GetFilePath(self.AccountTypes[AccountTypeId].Icon)
            return Base64Img:base64Sync(IconPath)
        end,
        --#endregion
    }
)

return AccountManager

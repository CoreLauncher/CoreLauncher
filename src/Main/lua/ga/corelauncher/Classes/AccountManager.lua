local AccountManager = {}
AccountManager.AccountTypes = {}
AccountManager.Accounts = {}

local Base64Img = TypeWriter:JsRequire("base64-img")
local UUID = TypeWriter:JsRequire("uuid").v4

function AccountManager:LoadAccountTypes(AccountTypes)
    self.AccountTypes = AccountTypes
end

function AccountManager:LoadAccounts(AccountList)

end

function AccountManager:GetAccountTypeInfo(AccountType)
    local AccountTypeData = self.AccountTypes[AccountType]
    return {
        Id = AccountTypeData.Id,
        Name = AccountTypeData.Name
    }
end

function AccountManager:ListAccountTypes()
    local AccountTypes = {}
    for _, AccountType in pairs(self.AccountTypes) do
        AccountTypes[AccountType.Id] = self:GetAccountTypeInfo(AccountType.Id)
    end
    return AccountTypes
end

function AccountManager:StartConnection(Type)
    self.AccountTypes[Type].StartConnection()
end

function AccountManager:FinishedConnection(Type, Data)
    TypeWriter.Logger:Information("Scope finished for " .. Type .. " account type")

    if self.AccountTypes[Type].FinishedConnection ~= nil then
        self.AccountTypes[Type].FinishedConnection(Data)
    else
        TypeWriter.Logger:Warning("No callback for " .. Type .. " account type")
    end
end

function AccountManager:SaveAccountData(Type, TokenData, DisplayData)
    TypeWriter.Logger:Information("Saving account data for " .. Type .. " account type")
    local AccountData = {
        Type = Type,
        ConnectedAt = os.time(os.date("!*t")),
        TokenData = TokenData,
        DisplayData = DisplayData,
        UUID = UUID()
    }
    CoreLauncher.DataBase:SetKey("Accounts." .. AccountData.UUID, ToJs(AccountData))
end

function AccountManager:RemoveAccount(UUID)
    CoreLauncher.DataBase:SetKey("Accounts." .. UUID, nil)
end

function AccountManager:ListAccounts()
    local AccountsObject = CoreLauncher.DataBase:GetKey("Accounts")
    if AccountsObject == nil then
        return {}
    end
    local Accounts = {}
    for _, AccountData in pairs(AccountsObject) do
        table.insert(Accounts, AccountData)
    end
    return Accounts
end

--#region Icons getting
function AccountManager:GetAccountTypeIcon(AccountTypeId)
    local IconPath = TypeWriter.ResourceManager:GetFilePath(self.AccountTypes[AccountTypeId].Icon)
    return FS:readFileSync(IconPath, "utf8")
end

function AccountManager:GetAccountTypeIconBase64(AccountTypeId)
    local IconPath = TypeWriter.ResourceManager:GetFilePath(self.AccountTypes[AccountTypeId].Icon)
    return Base64Img:base64Sync(IconPath)
end

--#endregion

return AccountManager

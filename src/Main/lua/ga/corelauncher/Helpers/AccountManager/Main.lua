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
        Name = AccountTypeData.Name,
        StartScopeLink = AccountTypeData.StartScopeLink,
    }
end

function AccountManager:ListAccountTypes()
    local AccountTypes = {}
    for _, AccountType in pairs(self.AccountTypes) do
        AccountTypes[AccountType.Id] = self:GetAccountTypeInfo(AccountType.Id)
    end
    return AccountTypes
end

function AccountManager:StartScope(Type)
    CoreLauncher.Electron.shell:openExternal(self.AccountTypes[Type].StartScopeLink)
end

function AccountManager:ScopeFinished(Type, Data)
    TypeWriter.Logger:Information("Scope finished for " .. Type .. " account type")

    if self.AccountTypes[Type].ScopeFinishedCallback ~= nil then
        self.AccountTypes[Type].ScopeFinishedCallback(Data)
    else
        TypeWriter.Logger:Warning("No callback for " .. Type .. " account type")
    end
end

function AccountManager:SaveScopeData(Type, Data)
    TypeWriter.Logger:Information("Saving scope data for " .. Type .. " account type")
    local AccountData = {
        Type = Type,
        ConnectedAt = os.time(os.date("!*t")),
        Data = Data,
        UUID = UUID()
    }
    CoreLauncher.DataBase:SetKey("Accounts." .. AccountData.UUID, ToJs(AccountData))
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

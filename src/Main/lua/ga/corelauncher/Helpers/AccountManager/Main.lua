local AccountManager = {}
AccountManager.AccountTypes = {}
AccountManager.Accounts = {}

local Base64Img = TypeWriter:JsRequire("base64-img")

function AccountManager:LoadAccountTypes(AccountTypes)
    self.AccountTypes = AccountTypes
end

function AccountManager:LoadAccounts(AccountList)
    
end

function AccountManager:ListAccountTypes()
    return self.AccountTypes
end

function AccountManager:StartScope(Type)
    CoreLauncher.Electron.shell:openExternal(self.AccountTypes[Type].StartScopeLink)
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
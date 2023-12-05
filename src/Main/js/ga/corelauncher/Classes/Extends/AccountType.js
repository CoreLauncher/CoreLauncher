const ResourceBase64 = await Import("ga.corelauncher.Helpers.ResourceBase64")
const CreateUUID = require("uuid").v4

class AccountType {
    constructor(Type, AccountInstanceClass) {

        const AccountsData = Object.values(CoreLauncher.DataBase.GetKey("Accounts") || {}).filter((Account) => Account.Type == Type)
        const AccountInstances = AccountsData.map(
            (AccountData) => {
                const AccountInstance = new AccountInstanceClass()
                AccountInstance.FromSavedData(AccountData.Data)
                AccountInstance.Type = Type
                AccountInstance.InstanceUUID = AccountData.UUID
                AccountInstance.ConnectedAt = AccountData.ConnectedAt
                return AccountInstance
            }
        )
        this.AccountInstances = AccountInstances
    }

    CreateInstance() {
        const Instance = new this.InstanceClass()
        Instance.Type = this.Type
        Instance.InstanceUUID = CreateUUID()
        Instance.ConnectedAt = new Date()
        this.AccountInstances.push(Instance)
        return Instance
    }

    GetIconBase64() {
        return ResourceBase64(this.Icon)
    }
}

return AccountType
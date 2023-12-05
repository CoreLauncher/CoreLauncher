const ResourceBase64 = await Import("ga.corelauncher.Helpers.ResourceBase64")

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
        console.log(AccountInstances)
        this.AccountInstances = AccountInstances
        console.log(this)
    }

    GetIconBase64() {
        return ResourceBase64(this.Icon)
    }
}

return AccountType
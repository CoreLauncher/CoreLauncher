class AccountInstance {
    constructor() {

    }

    Save() {
        const SaveData = this.SaveData()
        CoreLauncher.DataBase.SetKey(
            `Accounts.${this.InstanceUUID}`,
            {
                Type: this.Type,
                UUID: this.InstanceUUID,
                ConnectedAt: this.ConnectedAt,
                Data: SaveData
            }
        )
    }

    Delete() {
        const AccountType = CoreLauncher.GetAccountType(this.Type)
        AccountType.AccountInstances = AccountType.AccountInstances.filter((AccountInstance) => AccountInstance.InstanceUUID != this.InstanceUUID)
        CoreLauncher.DataBase.RemoveKey(`Accounts.${this.InstanceUUID}`)
    }
}

return AccountInstance
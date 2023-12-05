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
}

return AccountInstance
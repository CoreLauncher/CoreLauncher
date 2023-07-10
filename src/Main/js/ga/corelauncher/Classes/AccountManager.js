const UUID = require("uuid").v4
const ResourceBase64 = Import("ga.corelauncher.Libraries.ResourceBase64")

class AccountManager {
    constructor(AccountTypes) {
        this.AccountTypes = AccountTypes
    }

    GetAccountTypeInfo(AccountType) {
        const AccountTypeData = this.AccountTypes[AccountType]

        return {
            Id: AccountTypeData.Id,
            Name: AccountTypeData.Name,
            Icon: AccountTypeData.Icon,
        }
    }

    ListAccountTypes() {
        const AccountTypes = {}
        for (const AccountType in this.AccountTypes) {
            AccountTypes[AccountType] = this.GetAccountTypeInfo(AccountType)
        }
        return AccountTypes
    }

    StartConnection(AccountType) {
        this.AccountTypes[AccountType].StartConnection()
    }

    FinishedConnection(AccountType, ConnectionData) {
        TypeWriter.Logger.Information(`Connection finished for ${AccountType}.`)

        if (this.AccountTypes[AccountType].FinishedConnection) {
            this.AccountTypes[AccountType].FinishedConnection(ConnectionData)
        } else {
            TypeWriter.Logger.Warning(`No FinishedConnection function found for ${AccountType}.`)
        }
    }

    SaveAccountData(AccountType, TokenData, DisplayData) {
        TypeWriter.Logger.Information(`Saving account data for ${AccountType}.`)

        const AccountData = {
            Type: AccountType,
            TokenData: TokenData,
            DisplayData: DisplayData,

            ConnectedAt: new Date(),
            UUID: UUID()
        }

        CoreLauncher.DataBase.SetKey(`Accounts.${AccountData.UUID}`, AccountData)
    }

    RemoveAccount(UUID) {
        TypeWriter.Logger.Information(`Removing account ${UUID}.`)

        CoreLauncher.DataBase.RemoveKey(`Accounts.${UUID}`)
    }

    ListAccounts() {
        return Object.values(CoreLauncher.DataBase.GetKey("Accounts", {}))
    }

    GetAccountTypeIconBase64(AccountType) {
        return ResourceBase64(this.AccountTypes[AccountType].Icon)
    }

}

module.exports = AccountManager
const Screen = {}

var NewAccountBlock
var AccountTypeList
var AccountTypeTemplate
var AccountList
var AccountTemplate

async function ReloadAccountList() {
    AccountList.innerHTML = ""

    var Accounts = await CoreLauncher.AccountManager.ListAccounts()

    for (const Account of Accounts) {
        const AccountElement = AccountTemplate.cloneNode(true)

        AccountElement.querySelector(".icon").src = Account.DisplayData.Icon
        AccountElement.querySelector(".name").innerText = Account.DisplayData.Name
        AccountElement.querySelector(".accounttype").innerText = `(${Account.Type})`
        AccountElement.querySelector(".id").innerText = Account.DisplayData.Id

        if (Account.DisplayData.CreatedAt) {
            AccountElement.querySelector(".createdat").innerText = Account.DisplayData.ConnectedAt
        } else {
            AccountElement.querySelector(".createdat").innerText = "Created at: Unknown"
        }

        if (Account.ConnectedAt) {
            const ConnectedAt = new Date(Account.ConnectedAt)
            AccountElement.querySelector(".connectedat").innerText = `Connected at: ${ConnectedAt.toLocaleString()}`
        } else {
            AccountElement.querySelector(".connectedat").innerText = "Connected at: Unknown"
        }

        if (Account.DisplayData.ExpiresAt) {
            const ExpiresAt = new Date(Account.DisplayData.ExpiresAt)
            AccountElement.querySelector(".expiresat").innerText = `Expires at: ${ExpiresAt.toLocaleString()}`
        } else if (Account.DisplayData.ExpiresAt == false) {
                AccountElement.querySelector(".expiresat").innerText = "Expires: Never"
        } else {
            AccountElement.querySelector(".expiresat").innerText = "Expires at: Unknown"
        }

        AccountElement.querySelector(".removebutton").addEventListener(
            "click",
            async function () {
                await CoreLauncher.AccountManager.RemoveAccount(Account.UUID)
                await ReloadAccountList()
            }
        )

        AccountList.appendChild(AccountElement)
    }
}

Screen.Init = async function (ScreenElement, Screen) {
    NewAccountBlock = ScreenElement.querySelector(".newaccountblock")
    AccountTypeList = NewAccountBlock.querySelector(".accounttypes")
    AccountTypeTemplate = NewAccountBlock.querySelector(".accounttype")
    AccountTypeTemplate.remove()
    AccountList = ScreenElement.querySelector(".accountlist")
    AccountTemplate = AccountList.querySelector(".account")
    AccountTemplate.remove()

    const AccountTypes = await CoreLauncher.AccountManager.ListAccountTypes()

    if (Object.keys(AccountTypes).length == 0) {
        const WarningBlock = ScreenElement.querySelector(".noaccountsblock")
        WarningBlock.style.display = null
        WarningBlock.style.visibility = null

        NewAccountBlock.style.display = "none"
        NewAccountBlock.style.visibility = "hidden"
        return
    }

    for (const AccountTypeId in AccountTypes) {
        const AccountType = AccountTypes[AccountTypeId]
        const AccountTypeElement = AccountTypeTemplate.cloneNode(true)
        AccountTypeElement.querySelector("img").src = await CoreLauncher.AccountManager.GetAccountTypeIconBase64(AccountTypeId)
        AccountTypeElement.querySelector("a").innerText = AccountType.Name
        AccountTypeList.appendChild(AccountTypeElement)

        AccountTypeElement.addEventListener(
            "click",
            async function () {
                await CoreLauncher.AccountManager.StartConnection(AccountTypeId)
                await ReloadAccountList()
            }
        )
    }

}



Screen.Show = async function (ScreenElement, Screen) {
    ScreenElement.querySelectorAll(".accounttype.fullwidth").forEach(
        function (Element) {
            Element.style.setProperty("--hover-width", Element.clientWidth + 1 + "px")
            Element.classList.remove("fullwidth")
        }
    )

    await ReloadAccountList()
}

export default Screen
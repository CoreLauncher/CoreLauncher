let AccountTemplate

function LoadAccountsFromFilter(ScreenElement) {
    let Accounts = CoreLauncher.ListAccountInstances()
    const AccountFilter = ScreenElement.querySelector(".listfilter select")
    if (AccountFilter.value != "all") {
        Accounts = Accounts.filter(
            (Account) => {
                return Account.Type == AccountFilter.value
            }
        )
    }

    LoadAccounts(ScreenElement, Accounts)
}

function LoadAccounts(ScreenElement, Accounts) {
    const AccountsList = ScreenElement.querySelector(".instanceslist")
    AccountsList.innerHTML = ""

    for (const Account of Accounts) {
        const AccountElement = AccountTemplate.cloneNode(true)
        AccountElement.querySelector(".name").innerText = Account.GetName()
        AccountElement.querySelector(".id").innerText = Account.GetId()
        AccountElement.querySelector("img").src = Account.GetIcon()

        AccountElement.querySelector("button").addEventListener(
            "click",
            async () => {
                await Account.Delete()
                LoadAccountsFromFilter(ScreenElement)
            }
        )

        AccountsList.appendChild(AccountElement)
    }
}

return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {
        const AccountSelector = ScreenElement.querySelector(".accountselector select")
        const AccountFilter = ScreenElement.querySelector(".listfilter select")
        const StartConnectionButton = ScreenElement.querySelector(".accountselector button")

        StartConnectionButton.addEventListener(
            "click",
            async () => {
                const AccountType = CoreLauncher.GetAccountType(AccountSelector.value)
                await AccountType.StartConnection()
                LoadAccountsFromFilter(ScreenElement)
            }
        )

        AccountFilter.addEventListener(
            "change",
            () => {
                LoadAccountsFromFilter(ScreenElement)
            }
        )

        AccountTemplate = ScreenElement.querySelector(".account")
        AccountTemplate.remove()

    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Data) {
        const AccountTypes = CoreLauncher.ListAccountTypes()

        const AccountSelectorImage = ScreenElement.querySelector(".accountselector img")
        const AccountSelector = ScreenElement.querySelector(".accountselector select")

        const AccountFilterImage = ScreenElement.querySelector(".listfilter img")
        const AccountFilter = ScreenElement.querySelector(".listfilter select")

        AccountFilter.addEventListener("changed", () => {LoadAccountsFromFilter(ScreenElement)})

        AccountSelector.innerHTML = ""
        AccountFilter.innerHTML = ""

        const AllOption = document.createElement("option")
        AllOption.value = "all"
        AllOption.innerText = "All account types"
        AccountFilter.appendChild(AllOption)
        
        for (const AccountType of AccountTypes) {
            const AccountSelectorOption = document.createElement("option")
            AccountSelectorOption.value = AccountType.Type
            AccountSelectorOption.innerText = AccountType.Name
            AccountSelector.appendChild(AccountSelectorOption)

            const AccountFilterOption = document.createElement("option")
            AccountFilterOption.value = AccountType.Type
            AccountFilterOption.innerText = AccountType.Name
            AccountFilter.appendChild(AccountFilterOption)
        }

        function OnChangeFn(Img, Select) {
            return function() {
                if (Select.value == "all") {Img.src = ""; return}
                Img.src = CoreLauncher.GetAccountType(Select.value).GetIconBase64()
            }
        }

        AccountSelector.addEventListener("change", OnChangeFn(AccountSelectorImage, AccountSelector))
        OnChangeFn(AccountSelectorImage, AccountSelector)()
        AccountFilter.addEventListener("change", OnChangeFn(AccountFilterImage, AccountFilter))
        OnChangeFn(AccountFilterImage, AccountFilter)()

        LoadAccountsFromFilter(ScreenElement)

    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {

        const AccountSelectorImage = ScreenElement.querySelector(".accountselector img")
        const AccountFilterImage = ScreenElement.querySelector(".listfilter img")
        const AccountsList = ScreenElement.querySelector(".instanceslist")

        AccountSelectorImage.src = ""
        AccountFilterImage.src = ""
        AccountsList.innerHTML = ""

    }
}
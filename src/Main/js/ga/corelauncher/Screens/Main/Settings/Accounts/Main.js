let AccountTemplate

function LoadAccounts(ScreenElement, Accounts) {
    const AccountsList = ScreenElement.querySelector(".instanceslist")
    AccountsList.innerHTML = ""

    for (const Account of Accounts) {

        const AccountElement = AccountTemplate.cloneNode(true)
        AccountElement.querySelector(".name").innerText = Account.GetName()
        AccountElement.querySelector(".id").innerText = Account.GetId()
        AccountElement.querySelector("img").src = Account.GetIcon()
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

        AccountSelector.addEventListener("changed", OnChangeFn(AccountSelectorImage, AccountSelector))
        OnChangeFn(AccountSelectorImage, AccountSelector)()
        AccountFilter.addEventListener("changed", OnChangeFn(AccountFilterImage, AccountFilter))
        OnChangeFn(AccountFilterImage, AccountFilter)()

        LoadAccounts(ScreenElement, CoreLauncher.ListAccountInstances())

    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {

    }
}
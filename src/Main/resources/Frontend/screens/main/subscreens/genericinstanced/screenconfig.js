const Screen = {}

var Game
var PlayButton
var AccountSelector
var InstanceSelector
Screen.Init = async function (ScreenElement) {
    PlayButton = ScreenElement.querySelector(".playbutton")
    AccountSelector = ScreenElement.querySelector(".accountselector")
    InstanceSelector = ScreenElement.querySelector(".instanceselector")
    ScreenElement.querySelector(".settingsbutton").addEventListener(
        "click",
        async function () {
            await CoreLauncher.Settings.OpenGameSettings(Game.Id)
        }
    )

    PlayButton.addEventListener(
        "click",
        async function() {
            console.log(AccountSelector.value, InstanceSelector.value)
            await CoreLauncher.GameManager.LaunchGame(
                Game.Id,
                {
                    Account: AccountSelector.value,
                    Instance: InstanceSelector.value
                }
            )
        }
    )
}

Screen.Show = async function (ScreenElement, Screen, Data) {
    Game = Data

    ScreenElement.querySelector(".banner").style.backgroundImage = `url("${await CoreLauncher.GameManager.GetGameBannerBase64(Data.Id)}")`

    if (Game.UsesInstances) {
        InstanceSelector.style.display = "block"

        InstanceSelector.innerHTML = ""
        var Instances = await CoreLauncher.GameManager.ListInstances(Game.Id)

        for (const Instance of Instances) {
            const InstanceOption = document.createElement("option")
            InstanceOption.value = Instance.UUID
            InstanceOption.innerText = Instance.Name
            InstanceSelector.appendChild(InstanceOption)
        }
    } else {
        InstanceSelector.style.display = "none"
    }

    if (Game.UsesAccounts) {
        AccountSelector.style.display = "block"

        AccountSelector.innerHTML = ""
        var Accounts = await CoreLauncher.GameManager.GetValidAccounts(Game.Id)
        if (!Array.isArray(Accounts)) { Accounts = [] }

        for (const Account of Accounts) {
            const OptionElement = document.createElement("option")
            OptionElement.value = Account.UUID
            OptionElement.innerText = Account.DisplayData.Name
            AccountSelector.appendChild(OptionElement)
        }
    } else {
        AccountSelector.style.display = "none"
    }
}

export default Screen
const Screen = {}

var Game
var AccountSelector
var InstanceSelector
Screen.Init = async function (ScreenElement) {
    ScreenElement.querySelector(".settingsbutton").addEventListener(
        "click",
        async function () {
            await CoreLauncher.Settings.OpenGameSettings(Game)
        }
    )

    AccountSelector = ScreenElement.querySelector(".accountselector")
    InstanceSelector = ScreenElement.querySelector(".instanceselector")
}

Screen.Show = async function (ScreenElement, Screen, Data) {
    Game = Data

    ScreenElement.querySelector(".banner").style.backgroundImage = `url("${await CoreLauncher.GameManager.GetGameBannerBase64(Data.Id)}")`

    if (Game.UsesInstances) {
        InstanceSelector.style.display = "block"
        InstanceSelector.style.visibility = "visible"
    } else {
        InstanceSelector.style.display = "none"
        InstanceSelector.style.visibility = "hidden"
    }

    if (Game.UsesAccounts) {
        AccountSelector.style.display = "block"
        AccountSelector.style.visibility = "visible"

        AccountSelector.innerHTML = ""
        var Accounts = await CoreLauncher.GameManager.GetValidAccounts(Game.Id)
        if (!Array.isArray(Accounts)) { Accounts = [] }

        for (const Account of Accounts) {
            const OptionElement = document.createElement("option")
            OptionElement.value = Account.Id
            OptionElement.innerText = Account.DisplayData.Name
            AccountSelector.appendChild(OptionElement)
        }
    } else {
        AccountSelector.style.display = "none"
        AccountSelector.style.visibility = "hidden"
    }
}

export default Screen
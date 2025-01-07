return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {
        ScreenElement.querySelector(".settingsbutton").addEventListener(
            "click",
            function () {
                Screen.Data.OpenSettings()
            }
        )

        ScreenElement.querySelector("#launchbutton").addEventListener(
            "click",
            async function() {
                const Game = Screen.Data

                Game.Launch(
                    ScreenElement.querySelector(".instanceselect").value,
                    ScreenElement.querySelector(".accountselect").value
                )
            }
        )
    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Game) {
        ScreenElement.querySelector(".banner").style.setProperty(
            "background-image", 
            `url("${Game.GetBannerBase64()}")`
        )

        const InstanceSelect = ScreenElement.querySelector(".instanceselect")
        const AccountSelect = ScreenElement.querySelector(".accountselect")
        
        InstanceSelect.style.display = Game.UsesInstances ? "block" : "none"
        AccountSelect.style.display = Game.UsesAccounts ? "block" : "none"

        InstanceSelect.innerHTML = ""
        const Instances = Game.ListInstances().sort((A, B) => { return A.GetLastPlayed() - B.GetLastPlayed() }).reverse()
        for (const Instance of Instances) {
            const Option = document.createElement("option")
            Option.value = Instance.GetId()
            Option.innerText = Instance.GetName()
            InstanceSelect.appendChild(Option)
        }

        AccountSelect.innerHTML = ""
        const Accounts = Game.ListAccounts()
        for (const Account of Accounts) {
            const Option = document.createElement("option")
            Option.value = Account.GetId()
            Option.innerText = Account.GetName()
            AccountSelect.appendChild(Option)
        }
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {
        ScreenElement.querySelector(".banner").style.setProperty(
            "background-image", 
            ""
        )
    }
}
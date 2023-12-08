return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {
        ScreenElement.querySelector(".settingsbutton").addEventListener(
            "click",
            function () {
                Screen.Data.OpenSettings()
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
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {
        ScreenElement.querySelector(".banner").style.setProperty(
            "background-image", 
            ""
        )
    }
}
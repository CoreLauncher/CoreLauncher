const Screen = {}

Screen.Init = async function(ScreenElement) {
    ScreenElement.querySelector(".settingsbutton").addEventListener(
        "click",
        async function() {
            await CoreLauncher.OpenGameSettings(Game)
        }
    )
}

    ScreenElement.querySelector(".banner").style.backgroundImage = `url("${await CoreLauncher.GameManager.GetGameBannerBase64(Data.Id)}")`
}

export default Screen
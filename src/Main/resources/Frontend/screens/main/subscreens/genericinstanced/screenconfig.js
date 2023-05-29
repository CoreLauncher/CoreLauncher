const Screen = {}

var Game
Screen.Init = async function(ScreenElement) {
    ScreenElement.querySelector(".settingsbutton").addEventListener(
        "click",
        async function() {
            await CoreLauncher.OpenGameSettings(Game)
        }
    )
}

Screen.Show = async function(ScreenElement, Screen, Data) {
    Game = Data

    ScreenElement.querySelector(".banner").style.backgroundImage = `url("${await CoreLauncher.GameManager.GetGameBannerBase64(Data.Id)}")`
}

export default Screen
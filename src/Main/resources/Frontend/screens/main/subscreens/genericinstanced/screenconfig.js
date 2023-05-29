const Screen = {}

Screen.Init = async function(ScreenElement) {

    ScreenElement.querySelector(".banner").style.backgroundImage = `url("${await CoreLauncher.GameManager.GetGameBannerBase64(Data.Id)}")`
}

export default Screen
const Screen = {}

var Game
Screen.Init = function (ScreenElement, Screen) {
    ScreenElement.querySelector(".createinstancebutton").addEventListener(
        "click",
        function () {
            Screen.ParentScreen.GetScreen("createinstance").Show(false, Game)
        }
    )
}

Screen.Show = function (ScreenElement, Screen, Data) {
    Game = Data
}

export default Screen
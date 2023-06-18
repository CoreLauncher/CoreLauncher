const Screen = {}

var Game
Screen.Init = function (ScreenElement, Screen) {
    ScreenElement.querySelector(".cancelbutton").addEventListener(
        "click",
        function () {
            Screen.ParentScreen.GetScreen("instancelist").Show(false, Game)
        }
    )
}

Screen.Show = function (ScreenElement, Screen, Data) {
    Game = Data
}

export default Screen
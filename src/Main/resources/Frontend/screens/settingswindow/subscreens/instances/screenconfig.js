const Screen = {}

Screen.Show = function(ScreenElement, Screen, Data) {
    Screen.GetScreen("instancelist").Show(false, Data[0])
}

export default Screen
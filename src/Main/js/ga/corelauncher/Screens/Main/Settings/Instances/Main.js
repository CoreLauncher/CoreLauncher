return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {

    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Game) {
        Screen.GetScreen("List").Show(Game)
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {
        Screen.CurrentScreen.Hide()
    }
}
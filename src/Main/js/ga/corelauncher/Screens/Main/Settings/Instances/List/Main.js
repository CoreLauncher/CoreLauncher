return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {

    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Game) {
        ScreenElement.querySelector(".title").innerText = `${Game.Name} instances`
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {

    }
}
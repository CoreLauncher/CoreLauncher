const ImgUrl = "/assets/image/ico-nopad.gif"

return {
    Default: true,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {

    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Data) {
        ScreenElement.querySelector("img").src = ImgUrl
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {
        ScreenElement.querySelector("img").src = ""
    }
}
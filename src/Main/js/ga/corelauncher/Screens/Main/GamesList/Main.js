return {
    Default: true,

    Init: async function(Screen, ScreenElement, ScreenManager) {

    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager) {
        document.querySelector(".topbar .imageholder").classList.add("showbars")
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager) {
        document.querySelector(".topbar .imageholder").classList.remove("showbars")
    }
}
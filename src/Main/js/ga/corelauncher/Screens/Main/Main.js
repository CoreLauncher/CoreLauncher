return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager) {
        const NwWindow = nw.Window.get()

        ScreenElement.querySelector(".close").addEventListener("click", NwWindow.close.bind(NwWindow))
        ScreenElement.querySelector(".minimize").addEventListener("click", NwWindow.minimize.bind(NwWindow))
        ScreenElement.querySelector(".maximize").addEventListener("click", NwWindow.maximize.bind(NwWindow))

    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager) {
    
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager) {
    
    }
}
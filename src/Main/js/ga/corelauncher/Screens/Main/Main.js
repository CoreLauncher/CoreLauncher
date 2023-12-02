const OpenMainSettings = await Import("ga.corelauncher.Helpers.OpenMainSettings")

return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {
        const NwWindow = nw.Window.get()

        ScreenElement.querySelector(".close").addEventListener("click", NwWindow.close.bind(NwWindow))
        ScreenElement.querySelector(".minimize").addEventListener("click", NwWindow.minimize.bind(NwWindow))
        ScreenElement.querySelector(".maximize").addEventListener("click", NwWindow.maximize.bind(NwWindow))

        ScreenElement.querySelector(".settings").addEventListener("click", OpenMainSettings)

    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Data) {
    
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {
    
    }
}
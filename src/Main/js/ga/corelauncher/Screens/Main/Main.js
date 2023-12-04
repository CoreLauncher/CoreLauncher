const OpenMainSettings = await Import("ga.corelauncher.Helpers.OpenMainSettings")

return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {
        const NwWindow = nw.Window.get()

        let Maximized = false

        NwWindow.on("maximize", () => { Maximized = true })
        NwWindow.on("restore", () => { Maximized = false })

        ScreenElement.querySelector(".close").addEventListener("click", () => { NwWindow.close() })
        ScreenElement.querySelector(".minimize").addEventListener("click", () => { NwWindow.minimize() })
        ScreenElement.querySelector(".maximize").addEventListener("click", () => { Maximized ? NwWindow.restore() : NwWindow.maximize() })

        ScreenElement.querySelector(".settings").addEventListener("click", OpenMainSettings)

    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Data) {
    
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {
    
    }
}
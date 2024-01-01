return {
    Default: true,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {
        CoreLauncher.TaskManager.RegisterScreenElement(ScreenElement)
    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Game) {
        
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {
        
    }
}
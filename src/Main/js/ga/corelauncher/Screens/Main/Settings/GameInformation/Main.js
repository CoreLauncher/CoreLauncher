const PropertiesRenderer = await Import("ga.corelauncher.Helpers.PropertiesRenderer")

return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {

    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Game) {
        ScreenElement.querySelector(".title").innerText = Game.Name
        ScreenElement.querySelector(".description").innerText = Game.Description
        const PropertiesHolder = ScreenElement.querySelector(".propertiesholder")
        PropertiesHolder.innerHTML = ""
        PropertiesRenderer.Render(PropertiesHolder, Game.Properties(), Game.GetProperties())
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {

    }
}
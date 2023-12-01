const PropertiesRenderer = await Import("ga.corelauncher.Helpers.PropertiesRenderer")

return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {

    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Game) {
        console.log(Data)
        ScreenElement.querySelector(".title").innerText = Data.Name
        ScreenElement.querySelector(".description").innerText = Data.Description
        PropertiesRenderer.Render(ScreenElement.querySelector(".properties"), Data.GameProperties(), Data.FillData)
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {

    }
}
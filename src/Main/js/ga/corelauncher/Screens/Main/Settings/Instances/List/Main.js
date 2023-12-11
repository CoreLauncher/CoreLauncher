let InstanceTemplate

return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {
        ScreenElement.querySelector(".createbutton").addEventListener("click", () => { Screen.ParentScreen.GetScreen("Create").Show(Screen.Data) })

        InstanceTemplate = ScreenElement.querySelector(".instancelist .instance")
        InstanceTemplate.remove()
    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Game) {
        ScreenElement.querySelector(".title").innerText = `${Game.Name} instances`

        const Instances = Game.ListInstances()

        const InstanceListElement = ScreenElement.querySelector(".instancelist")
        InstanceListElement.innerHTML = ""

        for (const Instance of Instances) {
            const InstanceElement = InstanceTemplate.cloneNode(true)
            InstanceElement.querySelector(".name").innerText = Instance.GetName()
            InstanceElement.querySelector("img").src = Instance.GetIcon()
            
            InstanceListElement.appendChild(InstanceElement)
        }
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {

    }
}
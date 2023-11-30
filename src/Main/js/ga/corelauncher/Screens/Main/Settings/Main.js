let ReturnData
let TabTemplate

return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {
        ScreenElement.querySelector(".returnbutton").addEventListener(
            "click",
            function () {
                if (!ReturnData) { return }
                ReturnData.Screen.Show(ReturnData.Data)
                ReturnData = undefined
            }
        )

        TabTemplate = ScreenElement.querySelector(".tab")
        TabTemplate.remove()
    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Data) {
        if (!Data.ReturnData) {
            Data.ReturnData = {
                Screen: ScreenManager.GetScreen("Main.GamesList"),
                Data: undefined
            }
        }
        ReturnData = Data.ReturnData

        const TabsList = ScreenElement.querySelector(".tabslist")
        TabsList.innerHTML = ""
        for (const Tab of Data.Tabs) {
            if (typeof Tab === "string") {
                const TabHeaderElement = document.createElement("a")
                TabHeaderElement.classList.add("tabheader")
                TabHeaderElement.innerText = Tab
                TabsList.appendChild(TabHeaderElement)
            } else {
                const TabElement = TabTemplate.cloneNode(true)
                TabElement.querySelector("a").innerText = Tab.Name
                const TabScreen = Screen.GetScreen(Tab.Screen)
                TabElement.addEventListener(
                    "click",
                    function () {
                        const ActiveTab = TabsList.querySelector(".tab.active")
                        if (ActiveTab) { ActiveTab.classList.remove("active") }
                        TabElement.classList.add("active")
                        TabScreen.Show(Tab.Data)
                    }
                )
                TabsList.appendChild(TabElement)
            }
        }
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {

    }
}
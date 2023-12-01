let TabTemplate

return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {
        ScreenElement.querySelector(".returnbutton").addEventListener(
            "click",
            async function () {
                const ReturnData = Screen.Data.ReturnData
                if (!ReturnData) { return }
                await Screen.CurrentScreen.Hide()
                await ReturnData.Screen.Show(ReturnData.Data)
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
                if (!Screen.CurrentScreen) { TabElement.click() }
            }
        }
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {

    }
}
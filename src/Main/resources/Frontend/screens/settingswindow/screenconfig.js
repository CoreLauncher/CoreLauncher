const Screen = {}

var TransitionBackground = null

Screen.Init = function(ScreenElement, Screen) {
    TransitionBackground = document.createElement("div")
    TransitionBackground.classList.add("transitionbackground")
    TransitionBackground.classList.add("screenstyles")
    TransitionBackground.classList.add("hidden")
    document.body.appendChild(TransitionBackground)

    ScreenElement.classList.add("hidden")

    const CloseButton = ScreenElement.querySelector('.closebutton')

    function Close() {
        if (Screen.GetState() == false) { return }
        CoreLauncher.ScreenManager.GetScreen("main").Show()
    }

    CloseButton.addEventListener(
        "click",
        Close
    )

    document.addEventListener(
        "keydown",
        function(event) {
            if (event.key == "Escape") {
                Close()
            }
        }
    )

    ScreenElement.classList.add("hidden")
}

//Screen.ApplyShowStyle = false
Screen.Show = async function(ScreenElement, Screen, Data) {
    const TabsContainer = ScreenElement.querySelector(".settingslist")
    TabsContainer.innerHTML = ""

    var DefaultFound = false
    for (const TabsGroup of Data.Tabs) {

        const GroupLabel = document.createElement("a")
        GroupLabel.classList.add("tag")
        GroupLabel.innerText = TabsGroup.Name
        TabsContainer.appendChild(GroupLabel)

        for (const Tab of TabsGroup.Tabs) {

            const TabElement = document.createElement("div")
            TabElement.classList.add("settingstab")
            TabsContainer.appendChild(TabElement)

            const TitleElement = document.createElement("a")
            TitleElement.classList.add("title")
            TitleElement.innerText = Tab.Name
            TabElement.appendChild(TitleElement)

            const IndicatorElement = document.createElement("a")
            IndicatorElement.classList.add("indicator")
            IndicatorElement.innerText = "◀"
            TabElement.appendChild(IndicatorElement)

            TabElement.addEventListener(
                "click",
                function() {
                    RemoveClassFromChildren(TabsContainer, "active")
                    TabElement.classList.add("active")
                    Screen.GetScreen(Tab.Screen).Show(false, Tab.Data)
                }
            )

            if (Tab.Default == true) {
                TabElement.click()
            }
        }
    }

    if (DefaultFound == false) {
        TabsContainer.children[1].click()
    }

    ScreenElement.classList.remove("hidden")
    TransitionBackground.classList.remove("hidden")
    await sleep(200)
}

Screen.Hide = async function(ScreenElement) {
    ScreenElement.classList.add("hidden")
    TransitionBackground.classList.add("hidden")
    await sleep(200)
}


export default Screen
function GetScreenName(Element) {
    if (Element.classList[1] == "defaultscreen") {
        return Element.classList[2]

    } else {
        return Element.classList[1]
    }
}

class Screen {
    constructor(Object, ParentScreen = null) {
        this.Name = GetScreenName(Object)
        this.Object = Object
        this.ChildScreens = {}
        this.IsDefaultScreen = Object.classList.contains("defaultscreen")
        this.ParentScreen = ParentScreen

        this.ScreenConfig = require(`/screens/${this.Name}/screenconfig.js`)

        if (this.IsDefaultScreen) {
            this.Show(true)
        } else {
            this.Hide(true)
        }


        const This = this
        document.querySelectorAll(`.${this.Name} > .screen`).forEach(
            function (Element) {
                const ScreenObject = new Screen(Element, This)
                This.ChildScreens[ScreenObject.Name] = ScreenObject
            }
        )
    }

    GetScreen(Name) {
        if (this.ChildScreens[Name] != null) {
            return this.ChildScreens[Name]
        } else {
            return null
        }
    }

    GetDefaultScreen() {
        return this.ChildScreens.filter(
            function (Screen) {
                return Screen.IsDefaultScreen
            }
        )[0]
    }

    Show(NoAnimation = false) {
        if (this.ScreenConfig.Show && !NoAnimation) {
            this.ScreenConfig.Show()
        } else {
            this.Object.style.visibility = "visible"
        }
        this.State = true
        console.log(this.ParentScreen)
        if (this.ParentScreen.CurrentScreen) {
            this.ParentScreen.CurrentScreen.Hide()
        }
        this.ParentScreen.CurrentScreen = this
    }

    Hide(NoAnimation = false) {
        if (this.ScreenConfig.Hide && !NoAnimation) {
            this.ScreenConfig.Hide()
        } else {
            this.Object.style.visibility = "hidden"
        }

        this.State = false
    }

    Toggle() {
        if (this.State) {
            this.Hide()
        } else {
            this.Show()
        }
    }


}

const ScreenManager = {}
ScreenManager.CurrentScreen = null
ScreenManager.Screens = {}

ScreenManager.ScanScreens = async function () {
    document.querySelectorAll("body > .screen").forEach(
        function (Element) {
            const ScreenObject = new Screen(Element, ScreenManager)
            ScreenManager.Screens[ScreenObject.Name] = ScreenObject
        }
    )
}

ScreenManager.GetScreen = function (Name) {
    if (ScreenManager.Screens[Name] != null) {
        return ScreenManager.Screens[Name]
    } else {
        return null
    }
}


export default ScreenManager
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

        if (this.IsDefaultScreen) {
            Object.style.visibility = "visible"
            this.State = true
        } else {
            Object.style.visibility = "hidden"
            this.State = false
        }

        this.ScreenConfig = require(`/screens/${this.Name}/screenconfig.js`)

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

    Show() {
        if (this.ScreenConfig.Show) {
            this.ScreenConfig.Show()
        } else {
            this.Object.style.visibility = "visible"
        }
        this.State = true
    }

    Hide() {
        if (this.ScreenConfig.Hide) {
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
            const ScreenObject = new Screen(Element)
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
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
            this.Show(true)
        } else {
            this.Hide(true)
        }

        for (const Element of document.querySelectorAll(`.${this.Name} > .screen`)) {
            const ScreenObject = new Screen(Element, This)
            this.ChildScreens[ScreenObject.Name] = ScreenObject
        }
    }

    async FetchConfig() {
        this.ScreenConfig = await require(`/screens/${this.Name}/screenconfig.js`)
        if (this.ScreenConfig.Init) {
            await this.ScreenConfig.Init(this.Object)
        }
        for (const ScreenObjectKey in this.ChildScreens) {
            const ScreenObject = this.ChildScreens[ScreenObjectKey]
            await ScreenObject.FetchConfig()
        }
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

    async Show(NoAnimation = false) {
        if (this.ScreenConfig && this.ScreenConfig.Show && !NoAnimation) {
            await this.ScreenConfig.Show(this.Object)
        } else {
            this.Object.style.visibility = "visible"
        }
        this.State = true
        if (this.ParentScreen.CurrentScreen) {
            this.ParentScreen.CurrentScreen.Hide()
        }
        this.ParentScreen.CurrentScreen = this
    }

    async Hide(NoAnimation = false) {
        if (this.ScreenConfig && this.ScreenConfig.Hide && !NoAnimation) {
            await this.ScreenConfig.Hide(this.Object)
        } else {
            this.Object.style.visibility = "hidden"
        }

        this.State = false
    }

    Toggle() {
        if (this.State) {
            return this.Hide()
        } else {
            return this.Show()
        }
    }


}

const ScreenManager = {}
ScreenManager.CurrentScreen = null
ScreenManager.Screens = {}

ScreenManager.ScanScreens = async function () {
    for (const Element of document.querySelectorAll("body > .screen")) {
        const ScreenObject = new Screen(Element, ScreenManager)
        await ScreenObject.FetchConfig()
        ScreenManager.Screens[ScreenObject.Name] = ScreenObject
    }
}

ScreenManager.GetScreen = function (Name) {
    if (ScreenManager.Screens[Name] != null) {
        return ScreenManager.Screens[Name]
    } else {
        return null
    }
}


export default ScreenManager
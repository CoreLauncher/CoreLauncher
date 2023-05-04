function GetScreenName(Element) {
    if (Element.classList[1] == "defaultscreen") {
        return Element.classList[2]

    } else {
        return Element.classList[1]
    }
}

function GetParentWithClass(Element, ClassName) {
    const ParentElement = Element.parentElement
    if (ParentElement == null) {return null}
    if (ParentElement.classList.contains(ClassName)) {
        return ParentElement
    } else {
        return GetParentWithClass(ParentElement, ClassName)
    }
}

function GetDirectChildScreens(Element) {
    return Array.from(
        Element.querySelectorAll(".screen")
    ).filter(
        function (ChildElement) {
            const ParentWithClass = GetParentWithClass(ChildElement, "screen")
            return ParentWithClass == Element || ParentWithClass == null
        }
    )
}

class Screen {
    constructor(Object, ParentScreen = null) {
        this.Name = GetScreenName(Object)
        this.Object = Object
        this.ChildScreens = {}
        this.IsDefaultScreen = Object.classList.contains("defaultscreen")
        this.ParentScreen = ParentScreen
        if (this.ParentScreen.IsManager) {
            this.RequirePath = `${this.ParentScreen.RequirePath}/${this.Name}`
        } else {
            this.RequirePath = `${this.ParentScreen.RequirePath}/subscreens/${this.Name}`
        }

        if (this.IsDefaultScreen) {
            this.Show(true)
        } else {
            this.Hide(true)
        }

        for (const Element of GetDirectChildScreens(Object)) {
            const ScreenObject = new Screen(Element, this)
            this.ChildScreens[ScreenObject.Name] = ScreenObject
        }
    }

    async FetchConfig() {
        this.ScreenConfig = await require(`${this.RequirePath}/screenconfig.js`)
        for (const ScreenObjectKey in this.ChildScreens) {
            const ScreenObject = this.ChildScreens[ScreenObjectKey]
            await ScreenObject.FetchConfig()
        }
        if (this.ScreenConfig.Init) {
            await this.ScreenConfig.Init(this.Object, this)
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

    async Show(NoAnimation = false, Data) {
        if (this.ScreenConfig && this.ScreenConfig.Show && !NoAnimation) {
            await this.ScreenConfig.Show(this.Object, this, Data)
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
            await this.ScreenConfig.Hide(this.Object, this)
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
ScreenManager.IsManager = true
ScreenManager.RequirePath = `/screens`

ScreenManager.ScanScreens = async function () {
    for (const Element of GetDirectChildScreens(document.body)) {
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
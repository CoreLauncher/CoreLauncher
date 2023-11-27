const Path = require("path")
const WaitForEvent = await Import("ga.corelauncher.Helpers.WaitForEvent")

function GetScreen(Parent, Name, ReturnParent = false) {
    let ReturnScreen
    const SplitName = Name.split(".")
    if (SplitName.length == 1) {
        ReturnScreen = Parent.Screens[Name]
    } else {
        let Screen = Parent
        for (const NamePart of SplitName) {
            Screen = Screen.GetScreen(NamePart)
        }
        ReturnScreen = Screen
    }
    if (ReturnParent) {
        return ReturnScreen ? ReturnScreen.ParentScreen : Parent
    }
    return ReturnScreen
}

class Screen {
    constructor(Name, Handler, ParentScreen) {
        this.Name = Name
        this.ParentScreen = ParentScreen
        this.Screens = {}
    }

    GetPath(Append) {
        return this.ParentScreen.GetPath(this.Name)
    }

    ShowStyle() {
        this.Iframe.style.visibility = "visible"
        this.Iframe.style.display = null
        this.Iframe.style.zIndex = "1"
    }

    async Show(Data, SkipAnimation = false) {
        if (this.ParentScreen.CurrentScreen) {
            if (this.ParentScreen.CurrentScreen == this) { return }
            this.ParentScreen.CurrentScreen.Hide()
        }
        this.ParentScreen.CurrentScreen = this

        if (this.Handler.Show) {
            await this.Handler.Show(this, this.ScreenElement, Data)
        }

    }

    HideStyle() {
        this.Iframe.style.visibility = "hidden"
        this.Iframe.style.display = "none"
        this.Iframe.style.zIndex = "-1"
    }

    async Hide(SkipAnimation = false) {
        if (this.Handler.Hide) {
            await this.Handler.Hide(this, this.ScreenElement)
        }
    }
}

class ScreenManager {
    constructor() {
        this.Screens = {}
        this.ScreenElement = document.body
        console.log(this.ScreenElement)
    }

    GetPath(Append) {
        return Append
    }

    GetScreen(Name, ReturnParent = false) {
        return GetScreen(this, Name, ReturnParent)
    }

    async RegisterScreen(Name, Handler) {
        console.log(`Registering screen ${Name}`, Handler)
        const ScreenParent = this.GetScreen(Name, true)
        console.log(ScreenParent)
        const NewScreen = new Screen(Name, Handler, this)

        let ScreenHolder
        if (Handler.GetScreenElement) {
            ScreenHolder = await Handler.GetScreenElement(ScreenParent)
        } else {
            ScreenHolder = ScreenParent.ScreenElement.querySelector(`screen[name="${Name}"]`)
        }


        const ScreenFolder = Path.join("/screens/", NewScreen.GetPath().replaceAll(".", "/"))
        ScreenHolder.innerHTML = await (await fetch(`${ScreenFolder}/index.html`)).text()
        ScreenHolder.classList.add(Name)

        const LinkElement = document.createElement("link")
        LinkElement.rel = "stylesheet"
        LinkElement.href = `${ScreenFolder}/Index.css`
        document.head.appendChild(LinkElement)

        NewScreen.ScreenElement = ScreenHolder
        Handler.Init(NewScreen, NewScreen.ScreenElement, this)
    }
}

return ScreenManager
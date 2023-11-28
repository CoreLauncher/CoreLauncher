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
        this.Handler = Handler
    }

    GetPath(Append) {
        return this.ParentScreen.GetPath(this.Name)
    }

    ShowStyle() {
        this.ScreenElement.style.visibility = "visible"
        this.ScreenElement.style.display = null
        this.ScreenElement.style.zIndex = "1"
    }

    async Show(Data, SkipAnimation = false) {
        if (this.ParentScreen.CurrentScreen) {
            if (this.ParentScreen.CurrentScreen == this) { return }
            this.ParentScreen.CurrentScreen.Hide()
        }
        this.ParentScreen.CurrentScreen = this

        if (this.Handler.Show && !SkipAnimation) {
            await this.Handler.Show(this, this.ScreenElement, Data)
            if (this.Handler.ApplyShowStyle) {
                this.ShowStyle()
            }
        } else {
            this.ShowStyle()
        }

    }

    HideStyle() {
        this.ScreenElement.style.visibility = "hidden"
        this.ScreenElement.style.display = "none"
        this.ScreenElement.style.zIndex = "-1"
    }

    async Hide(SkipAnimation = false) {
        if (this.Handler.Hide && !SkipAnimation) {
            await this.Handler.Hide(this, this.ScreenElement)
            if (this.Handler.ApplyHideStyle) {
                this.HideStyle()
            }
        } else {
            this.HideStyle()
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
        const NewScreen = new Screen(Name, Handler, ScreenParent)

        let ScreenHolder
        if (Handler.GetScreenElement) {
            ScreenHolder = await Handler.GetScreenElement(ScreenParent)
        } else {
            ScreenHolder = ScreenParent.ScreenElement.querySelector(`screen[name="${Name}"]`)
        }

        const ScreenFolder = Path.join("/screens/", NewScreen.GetPath().replaceAll(".", "/"))

        const LinkElement = document.createElement("link")
        LinkElement.rel = "stylesheet"
        LinkElement.href = `${ScreenFolder}/Index.css`
        document.head.appendChild(LinkElement)

        ScreenHolder.innerHTML = await (await fetch(`${ScreenFolder}/index.html`)).text()
        ScreenHolder.classList.add(Name)

        NewScreen.ScreenElement = ScreenHolder
        if (!Handler.Default) { await NewScreen.Hide() } else { await NewScreen.Show() }
        ScreenParent.Screens[Name] = NewScreen
        Handler.Init(NewScreen, NewScreen.ScreenElement, this)
    }
}

return ScreenManager
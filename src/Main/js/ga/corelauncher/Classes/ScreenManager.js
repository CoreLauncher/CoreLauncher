const Path = require("path")
const WaitForEvent = await Import("ga.corelauncher.Helpers.WaitForEvent")
const DeSVG = await Import("ga.corelauncher.Helpers.DeSVG")

function GetScreen(Parent, Name, ReturnParent = false) {
    let ReturnScreen
    const SplitName = Name.split(".")
    if (SplitName.length == 1) {
        ReturnScreen = Parent.Screens[Name]
    } else {
        let Screen = Parent
        for (const NamePart of SplitName) {
            if (!Screen.Screens[NamePart] && SplitName[SplitName.length - 1] == NamePart) {
                return Screen
            }
            Screen = Screen.Screens[NamePart]
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

    GetPath() {
        return this.Name
    }

    GetScreen(Name, ReturnParent = false) {
        return GetScreen(this, Name, ReturnParent)
    }

    ShowStyle() {
        this.ScreenElement.style.visibility = "visible"
        this.ScreenElement.style.display = null
        this.ScreenElement.style.zIndex = "1"
    }

    async Show(Data, SkipAnimation = false) {
        if (!this.CurrentScreen) {
            for (const ScreenName in this.Screens) {
                const SubScreen = this.Screens[ScreenName]
                if (!SubScreen.Handler.Default) { continue }
                await SubScreen.Show()
                break
            }
        }

        if (this.ParentScreen.CurrentScreen) {
            if (this.ParentScreen.CurrentScreen == this) { return }
            this.ParentScreen.CurrentScreen.Hide()
        }
        this.ParentScreen.CurrentScreen = this

        if (this.ParentScreen.Show) { await this.ParentScreen.Show() }

        if (this.Handler.Show && !SkipAnimation) {
            await this.Handler.Show(this, this.ScreenElement, this, Data)
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
    }

    GetScreen(Name, ReturnParent = false) {
        return GetScreen(this, Name, ReturnParent)
    }

    async RegisterScreen(ScreenPath, Handler) {
        const ScreenParent = this.GetScreen(ScreenPath, true)
        const NewScreen = new Screen(ScreenPath, Handler, ScreenParent)
        const Name = ScreenPath.split(".").pop()

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

        await DeSVG(ScreenHolder)
        NewScreen.ScreenElement = ScreenHolder
        Handler.Init(NewScreen, NewScreen.ScreenElement, this)
        if (Handler.Default && ScreenParent == this) { await NewScreen.Show() } else { await NewScreen.HideStyle() }
        ScreenParent.Screens[Name] = NewScreen
    }
}

return ScreenManager
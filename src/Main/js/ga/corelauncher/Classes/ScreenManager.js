async function RegisterScreen(Parent, Name, Handler) {
    console.log(`Registering screen ${Name}`, Handler)
    const ScreenParent = Parent.GetScreen(Name, true)
    console.log(ScreenParent)
    const NewScreen = new Screen(Name, Parent)
    
    let ScreenHolder
    let Append = false
    if (Handler.GetScreenElement) {
        ScreenHolder = await Handler.GetScreenElement(ScreenParent)
    } else {
        ScreenHolder = ScreenParent.ScreenElement.querySelector(`screen[name="${Name}"]`)
    }

    const Iframe = ScreenHolder.ownerDocument.createElement("iframe")
    console.log(Iframe)
    console.log(NewScreen.GetPath())

    console.log(ScreenHolder)
}

function GetScreen(Parent, Name, ReturnParent = false) {
    const SplitName = Name.split(".")
    if (SplitName.length == 1) {
        return ReturnParent ? Parent : this.Screens[Name]
    } else {
        let Screen = Parent
        for (const NamePart of SplitName) {
            Screen = Screen.GetScreen(NamePart)
        }
        return Screen
    }
}

class Screen {
    constructor(Name, ParentScreen) {
        this.Name = Name
        this.ParentScreen = ParentScreen
        this.Screens = {}
    }

    GetPath(Append) {
        return this.ParentScreen.GetPath(this.Name)
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
        await RegisterScreen(this, Name, Handler)
    }
}

return ScreenManager
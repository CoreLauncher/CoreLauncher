const ContextService = {}

const Menu = document.createElement("div")
Menu.classList.add("contextmenu")
document.body.appendChild(Menu)

ContextService.ShowMenu = async function(Buttons, X = MousePosition.X, Y = MousePosition.Y) {
    Menu.innerHTML = ''
    for (const ContextButton of Buttons) {
        const ContextButtonElement = document.createElement("div")
        ContextButtonElement.classList.add("contextbutton")
        ContextButtonElement.addEventListener(
            "click",
            async function() {
                await ContextButton.Callback()
            }
        )

        const ContextLabel = document.createElement("a")
        ContextLabel.innerText = ContextButton.Label
        ContextLabel.classList.add("contextlabel")
        ContextButtonElement.appendChild(ContextLabel)

        const ContextImage = document.createElement("img")
        ContextImage.src = ContextButton.Image
        ContextImage.classList.add("contextimage")
        ContextButtonElement.appendChild(ContextImage)

        Menu.appendChild(ContextButtonElement)
    }
    Menu.style.top = `${Y}px`
    Menu.style.left = `${X}px`
}

ContextService.HideContextMenu = async function() {
    ContextService.ShowMenu(
        [],
        -500,
        -500
    )
}
ContextService.HideContextMenu()


export default ContextService
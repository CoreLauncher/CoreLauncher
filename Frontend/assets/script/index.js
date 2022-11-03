const IsInIframe = window.self !== window.top
const urlSearchParams = new URLSearchParams(window.location.search); window.QueryParameters = Object.fromEntries(urlSearchParams.entries());
window.p = console.log

//#region Mouse pos
if (IsInIframe) {
    window.MousePosition = window.top.MousePosition
    window.addEventListener(
        "mousemove",
        async function(E) {
            const Bound = window.frameElement.getBoundingClientRect()
            MousePosition.X = E.pageX + Bound.left
            MousePosition.Y = E.pageY + Bound.top
        }
    )
} else {
    window.MousePosition = {}
    window.addEventListener(
        "mousemove",
        async function(E) {
            MousePosition.X = E.pageX
            MousePosition.Y = E.pageY
        }
    )
}
//#endregion
//#region Main api
if (IsInIframe) {
    window.CoreLauncher = window.top.CoreLauncher
} else {
    window.CoreLauncher = {
        IPC: new OpenIPC("CoreLauncher", "Render"),
    }
    CoreLauncher.ExtLink = async function(Link) {
        await CoreLauncher.IPC.Send(
            "Main",
            "Other.ExtLink",
            Link
        )
    }
}
//#endregion
//#region additional prototypes
String.prototype.interpolate = function(params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
}

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//#endregion
//#region context menu
if (IsInIframe) {
    window.ShowContextMenu = window.top.ShowContextMenu
    window.HideContextMenu = window.top.HideContextMenu
    
    
} else {
    const Menu = document.createElement("div")
    Menu.classList.add("contextmenu")
    document.body.appendChild(Menu)

    window.ShowContextMenu = async function(Buttons, X = MousePosition.X, Y = MousePosition.Y) {
        Menu.innerHTML = ''
        for (const ContextButton of Buttons) {
            const ContextButtonElement = document.createElement("div")
            ContextButtonElement.classList.add("contextbutton")

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
    window.HideContextMenu = async function() {
        ShowContextMenu(
            [],
            -500,
            -500
        )
    }
    HideContextMenu()
}
window.addEventListener(
    "mouseup",
    async function() {
        await HideContextMenu()
    }
)
//#endregion
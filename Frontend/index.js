//#region Game bar resizing
window.addEventListener(
    "load",
    async function() {
        const Logo = document.getElementById("topbarlogo")
        const GamesList = document.getElementById("topbargameslist")
        const WindowControl = document.getElementById("topbarwindowcontrol")
        async function Resize(R) {
            GamesList.style.setProperty("--width", `${document.body.offsetWidth - Logo.offsetWidth - WindowControl.offsetWidth - 2}px`)
            if (R != true) {
                await setTimeout(Resize, 1, true)
            }
        }
        addEventListener(
            "resize",
            Resize
        )
        await Resize()
    }
)
//#endregion
//#region GameBar scrolling
window.addEventListener(
    "load",
    async function() {
        const GamesList = document.getElementById("topbargameslist")
        GamesList.addEventListener("wheel", (Event) => {
            Event.preventDefault();
            GamesList.scrollLeft += Event.deltaY;
        });
    }
)
//#endregion
//#region Window control
window.addEventListener(
    "load",
    async function() {
        document.getElementById("minimizebutton").addEventListener(
            "click",
            async function() {
                CoreLauncher.IPC.Send(
                    "Main",
                    "Window.Minimize"
                )
            }
        )

        document.getElementById("maximizebutton").addEventListener(
            "click",
            async function() {
                CoreLauncher.IPC.Send(
                    "Main",
                    "Window.Maximize"
                )
            }
        )

        document.getElementById("closebutton").addEventListener(
            "click",
            async function() {
                CoreLauncher.IPC.Send(
                    "Main",
                    "Window.Close"
                )
            }
        )
    }
)
//#endregion
//#region gameslist
window.addEventListener(
    "load",
    async function() {
        const Template = document.getElementById("game")
        const GameList = document.getElementById("topbargameslist")
        Template.remove()

        const Games = await CoreLauncher.IPC.Send(
            "Main",
            "Games.List"
        )

        for (const GameId in Games) {
            const Game = Games[GameId]
            const GameElement = Template.cloneNode(true)
            GameElement.querySelector(".icon").src = Game.Icon
            GameList.appendChild(GameElement)
        }
    }
)
//#endregion
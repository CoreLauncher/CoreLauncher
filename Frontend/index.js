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
//#region PageManager
const Pages = []
var SelectedPage = null
async function RegisterPage(ClickBlock, IndicatorBlock, IndicatorClass, PageUrl, PageName, Selected = false) {
    const Data = {
        ClickBlock: ClickBlock,
        IndicatorBlock: IndicatorBlock,
        IndicatorClass: IndicatorClass,
        PageUrl: PageUrl,
        PageName: PageName
    }
    Pages.push(Data)
    ClickBlock.addEventListener(
        "click",
        function() {
            if (SelectedPage == Data) {console.log("Page already selected"); return}
            for (const Page of Pages) {
                Page.IndicatorBlock.classList.remove(Page.IndicatorClass)
            }
            Data.IndicatorBlock.classList.add(Data.IndicatorClass)
            document.getElementById("mainframe").src = Data.PageUrl
            SelectedPage = Data
        }
    )
    if (Selected == true) {
        ClickBlock.click()
    }
}
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
            await RegisterPage(
                GameElement,
                GameElement,
                "selected",
                `/pages/instancepage?gameid=${GameId}`,
                `GamePage${GameId}`,
                true
            )
            GameList.appendChild(GameElement)
        }
    }
)
//#endregion
//#region Show notifications
window.addEventListener(
    "load",
    async function() {
        {
            const Info = await CoreLauncher.IPC.Send(
                "Main",
                "Other.NeedToShowRelease"
            )
            if (Info.NeedsToBeShown) {
                CoreLauncher.API.NotificationService.Show(
                    "ReleaseInfo",
                    "/notifications/updateinfo/",
                    `New update (${Info.Release.Name}@${Info.Release.Tag})`
                )
            }
        }
        {
            const IsDiscordConnected = await CoreLauncher.IPC.Send(
                "Main",
                "Accounts.Has",
                "Discord"
            )
            if (IsDiscordConnected == false) {
                CoreLauncher.API.NotificationService.Show(
                    "Welcome",
                    "/notifications/welcome/",
                    "Welcome to CoreLauncher!",
                    "",
                    false
                )
            } else {
                CoreLauncher.DiscordConnected = true
            }
        }
    }
)
//#endregion
//#region Load user ico
window.addEventListener(
    "load",
    async function() {
        
    }
)
//#endregion
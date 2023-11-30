return {
    Default: true,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {

    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Data) {
        document.querySelector(".topbar .imageholder").classList.add("showbars")

        const IconsColumn = ScreenElement.querySelector(".iconcolumn")

        const Games = CoreLauncher.GameManager.ListGames()

        IconsColumn.innerHTML = ""
        for (const Game of Games) {
            const IconHolder = document.createElement("div")
            IconHolder.classList.add("icon")
            IconsColumn.appendChild(IconHolder)

            const Icon = document.createElement("img")
            Icon.src = Game.GetIconBase64()
            IconHolder.appendChild(Icon)

            IconHolder.addEventListener(
                "click",
                async function () {
                    if (IconHolder.classList.contains("selected")) { return }
                    CoreLauncher.DataBase.SetKey("States.GamesList.SelectedGame", Game.Id)
                    IconsColumn.querySelector(".selected")?.classList.remove("selected")
                    IconHolder.classList.add("selected")
                    await Screen.GetScreen(Game.PlayScreenType).Show(Game)
                }
            )

            const SelectedGame = CoreLauncher.DataBase.GetKey("States.GamesList.SelectedGame")
            if (SelectedGame == Game.Id || SelectedGame == undefined) {
                IconHolder.click()
            }


        }
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {
        document.querySelector(".topbar .imageholder").classList.remove("showbars")
    }
}
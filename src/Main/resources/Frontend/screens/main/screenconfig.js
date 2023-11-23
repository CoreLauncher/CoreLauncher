const Screen = {}

Screen.Init = async function (ScreenElement, Screen) {

    let SetNamesWidth
    let GetNamesWidth

    { // Window control
        const TopbarElement = document.querySelector('.topbar')
        const WindowControl = TopbarElement.querySelector('.windowcontrol')

        const CloseButton = WindowControl.querySelector('.close')
        CloseButton.addEventListener(
            'click',
            CoreLauncher.WindowControl.Close
        )

        const MinimizeButton = WindowControl.querySelector('.minimize')
        MinimizeButton.addEventListener(
            'click',
            CoreLauncher.WindowControl.Minimize
        )

        const MaximizeButton = WindowControl.querySelector('.maximize')
        MaximizeButton.addEventListener(
            'click',
            CoreLauncher.WindowControl.Maximize
        )

        const SettingsButton = WindowControl.querySelector('.settings')
        SettingsButton.addEventListener(
            'click',
            CoreLauncher.Settings.OpenSettings
        )
    }

    { // Task Manager
        const TaskManagerElement = document.querySelector('.taskmanager')
        const SizeIconElement = TaskManagerElement.querySelector('.sizeicon')
        const TaskHolderElement = TaskManagerElement.querySelector('.taskholder')
        const TaskTemplateElement = TaskManagerElement.querySelector('.task')
        TaskTemplateElement.remove()

        const TaskBars = {}

        SizeIconElement.addEventListener(
            "click",
            function () {
                document.body.classList.toggle("taskmanager-expanded")
                TaskManagerElement.classList.toggle("expanded")
            }
        )

        const TaskbarStates = ["pending", "running", "completed"]
        function SetTaskBarState(TaskBar, NewState) {
            const BarHolder = TaskBar.querySelector(".progressbarholder")
            for (const State of TaskbarStates) {
                if (State != NewState) {
                    BarHolder.classList.remove(State)
                }
            }
            BarHolder.classList.add(NewState)
        }

        async function RefreshTasks() {
            const Processes = await CoreLauncher.TaskManager.ListProcesses()
            if (Object.values(Processes).length == 0) {
                TaskHolderElement.classList.add("noitems")
            } else {
                TaskHolderElement.classList.remove("noitems")
            }

            for (const Process of Object.values(Processes)) {
                if (!TaskBars[Process.Id]) {
                    console.log("Creating task bar.")
                    const BarElement = TaskTemplateElement.cloneNode(true)
                    TaskBars[Process.Id] = {
                        Element: BarElement,
                        Tasks: {}
                    }
                    TaskHolderElement.appendChild(BarElement)
                }

                const ProcessBar = TaskBars[Process.Id]
                ProcessBar.Element.querySelector('.taskname').innerText = Process.Name
                ProcessBar.Element.querySelector(".progressbar").style.width = `${(Object.values(Process.Tasks).filter(Task => Task.Completed >= Task.Total).length / Object.values(Process.Tasks).length) * 100}%`

                for (const Task of Object.values(Process.Tasks).sort(Task => Task.Step)) {
                    if (!TaskBars[Process.Id].Tasks[Task.Id]) {
                        console.log("Creating task bar.")
                        const BarElement = TaskTemplateElement.cloneNode(true)
                        TaskBars[Process.Id].Tasks[Task.Id] = {
                            Element: BarElement
                        }
                        BarElement.style.setProperty("--parent-count", 1)
                        BarElement.setAttribute("parent-count", 1)
                        BarElement.querySelector('.taskname').innerText = Task.Name
                        TaskHolderElement.appendChild(BarElement)
                    }

                    const TaskBar = TaskBars[Process.Id].Tasks[Task.Id]
                    TaskBar.Element.querySelector('.taskname').innerText = `${Task.Name} (${Task.State})`
                    TaskBar.Element.querySelector(".progressbar").style.width = `${(Task.Completed / Task.Total) * 100}%`

                    if (Task.Completed == -1) {
                        SetTaskBarState(TaskBar.Element, "pending")
                    } else if (Task.Completed < Task.Total) {
                        SetTaskBarState(TaskBar.Element, "running")
                    } else {
                        SetTaskBarState(TaskBar.Element, "completed")
                    }

                }
            }
        }

        RefreshTasks()
        setInterval(
            RefreshTasks,
            20
        )

    }

    { // Burger menu
        const TopbarElement = document.querySelector('.topbar')
        const BurgerMenu = TopbarElement.querySelector('.imageholder')

        BurgerMenu.addEventListener(
            "click",
            function () {
                if (GetNamesWidth() == 0) {
                    SetNamesWidth(300)
                } else {
                    SetNamesWidth(0)
                }
            }
        )
    }

    { // Dragline
        const HoverLine = ScreenElement.querySelector('.dragline')
        const Names = ScreenElement.querySelector('.names')
        const PlayScreenHolder = ScreenElement.querySelector('.playscreenholder')
        let Dragging = false
        const MinWidth = 200

        HoverLine.addEventListener('mousedown', function () {
            HoverLine.classList.add("dragging")
            Dragging = true
        })

        document.addEventListener('mouseup', function () {
            HoverLine.classList.remove("dragging")
            Dragging = false
        })

        function SetWidth(Width) {
            PlayScreenHolder.style.width = `calc(100% - ${Width + 30}px)`
            Names.style.width = `${Width}px`
        }
        SetNamesWidth = SetWidth
        SetWidth(0)

        function GetWidth() {
            return Names.getBoundingClientRect().width
        }
        GetNamesWidth = GetWidth


        document.addEventListener('mousemove', function (e) {
            if (Dragging) {
                let Width = e.clientX - 30
                if (Width < MinWidth) {
                    Width = 0
                } else {
                    Width = Math.clamp(Width, MinWidth, 300)
                }
                SetWidth(Width)
            }
        })
    }

    { // Load games
        const Names = ScreenElement.querySelector('.names')
        const Icons = ScreenElement.querySelector('.icons')

        const GamesList = await CoreLauncher.GameManager.ListGames()
        const SelectedGame = await CoreLauncher.DataBase.GetKey("States.GamesList.SelectedGame")

        for (const GameId in GamesList) {
            const Game = GamesList[GameId]

            let IconHolder
            { // Icon
                const HolderDiv = document.createElement("div")
                const IconElement = document.createElement("img")
                IconElement.src = await CoreLauncher.GameManager.GetGameIconBase64(GameId)
                HolderDiv.appendChild(IconElement)
                Icons.appendChild(HolderDiv)
                IconHolder = HolderDiv
            }
            let NameHolder
            { // Name
                const HolderDiv = document.createElement("div")
                const NameElement = document.createElement("a")
                NameElement.innerText = Game.Name
                HolderDiv.appendChild(NameElement)
                Names.appendChild(HolderDiv)
                NameHolder = HolderDiv
            }

            function HoverOther(Element, OtherElement) {
                Element.addEventListener('mouseover', function () {
                    OtherElement.classList.add('hover')
                })
                Element.addEventListener('mouseout', function () {
                    OtherElement.classList.remove('hover')
                })
            }
            HoverOther(IconHolder, NameHolder)
            HoverOther(NameHolder, IconHolder)

            function Select() {
                if (IconHolder.classList.contains('selected')) {
                    return
                }

                RemoveClassFromChildren(IconHolder.parentElement, 'selected')
                RemoveClassFromChildren(NameHolder.parentElement, 'selected')

                IconHolder.classList.add('selected')
                NameHolder.classList.add('selected')

                CoreLauncher.DataBase.SetKey("States.GamesList.SelectedGame", GameId)
                console.log(`Selected game: `, Game)
                Screen.GetScreen(Game.PlayScreenType).Show(false, Game)
            }

            if (GameId == SelectedGame) {
                Select()
            }

            IconHolder.addEventListener('click', Select)
            NameHolder.addEventListener('click', Select)

        }
    }

}

Screen.Show = async function (ScreenElement, Screen, Data) {
    const TopbarElement = document.querySelector('.topbar')
    const BurgerMenu = TopbarElement.querySelector('.imageholder')
    BurgerMenu.classList.add("showbars")
}

Screen.Hide = async function (ScreenElement, Screen) {
    const TopbarElement = document.querySelector('.topbar')
    const BurgerMenu = TopbarElement.querySelector('.imageholder')
    BurgerMenu.classList.remove("showbars")
}

export default Screen
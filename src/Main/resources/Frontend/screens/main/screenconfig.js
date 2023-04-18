const Screen = {}

Screen.Init = async function(ScreenElement) {

    { // Dragline
        const HoverLine = ScreenElement.querySelector('.dragline')
        const Names = ScreenElement.querySelector('.names')
        const PlayScreenHolder = ScreenElement.querySelector('.playscreenholder')
        var Dragging = false
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
        SetWidth(0)

        document.addEventListener('mousemove', function (e) {
            if (Dragging) {
                var Width = e.clientX - 30
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
        console.log(GamesList)

        for (const GameId in GamesList) {
            const Game = GamesList[GameId]

            var IconHolder
            { // Icon
                const HolderDiv = document.createElement("div")
                const IconElement = document.createElement("img")
                IconElement.src = await CoreLauncher.GameManager.GetGameIconBase64(GameId)
                HolderDiv.appendChild(IconElement)
                Icons.appendChild(HolderDiv)
                IconHolder = HolderDiv
            }
            var NameHolder
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
            
        }
    }
    
}

Screen.Show = async function(ScreenElement, Screen) {
    ScreenElement.style.visibility = "visible"
    Screen.GetScreen("genericinstanced").Show()
}

export default Screen
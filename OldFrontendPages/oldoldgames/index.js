window.addEventListener(
    "load",
    async function() {
        const Template = document.getElementsByClassName("game-tile")[0]
        Template.remove()
        const GameHolder = document.getElementById("games-holder")
        const Games = await CoreLauncher.IPC.Send(
            "Main",
            "Games.GetGames"
        )
        Games.forEach(Game => {
            const GameElement = Template.cloneNode(true)
            GameElement.querySelector("#game-icon").src = Game.Icon
            GameElement.querySelector("#game-name").innerText = Game.Name
            GameElement.querySelector("#game-creator").innerText = Game.Developer.Name
            GameElement.querySelector("#game-creator").setAttribute("href", Game.Developer.Website)
            GameElement.addEventListener(
                "click",
                function() {
                    location = "/instances/?game=" + Game.Id
                }
            )
            GameHolder.appendChild(GameElement)
        });
    }
)
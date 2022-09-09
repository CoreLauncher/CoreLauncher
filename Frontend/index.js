async function LoadGameCards() {
    const Template = document.querySelector("#game-card")
    console.log(Template)
    Template.remove()
    const GameHolder = document.getElementById("games-holder")
    const Games = await CoreLauncher.IPC.Send(
        "Main",
        "Games.GetGames"
    )
    Games.forEach(Game => {
        const GameElement = Template.cloneNode(true)
        GameElement.querySelector("#game-icon").src = Game.Icon
        GameElement.querySelector("#game-label").innerText = Game.Name
        GameElement.addEventListener(
            "click",
            function() {
                document.getElementById("mainframe").src = "/gamepage/?game=" + Game.Id
            }
        )
        GameHolder.appendChild(GameElement)
    });
}

async function LoadUI() {
    var DiscordUserData = await CoreLauncher.IPC.Send(
        "Main",
        "Accounts.Discord.GetAccount"
    )
    console.log(DiscordUserData)
    document.getElementById("user-icon").src = `https://cdn.discordapp.com/avatars/${DiscordUserData.Id}/${DiscordUserData.Avatar}.png`
}

async function CheckDiscord() {
    var DiscordConnected = await CoreLauncher.IPC.Send(
        "Main",
        "Accounts.IsConnected",
        "Discord"
    )
    if (DiscordConnected == true) {} else {
        location = "/welcome/"
    }
}

window.addEventListener(
    "load",
    async function() {
        await LoadGameCards()
        await CheckDiscord()
        await LoadUI()
    }
)

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

async function LoadGameCards() {
    const Template = document.querySelector("#game-card")
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
        RegisterPage(GameElement, GameElement.querySelector("#selectedblock"), "selected-block", `/gamepage/?game=${Game.Id}`, Game.Name)
        GameHolder.appendChild(GameElement)
    });
}

async function LoadUI() {
    var DiscordUserData = await CoreLauncher.IPC.Send(
        "Main",
        "Accounts.Discord.GetAccount"
    )
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
        await RegisterPage(document.getElementById("logo-holder"), document.getElementById("logo-holder"), "logo-selected", "/about/", "About", true)
    }
)

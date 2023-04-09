async function CheckRequiredAccounts(Game) {
    for (const AccountType of Game.RequiresAccounts) {
        const Connected = await CoreLauncher.IPC.Send(
            "Main",
            "Accounts.IsConnected",
            AccountType
        )
        if (Connected == false) {
            return AccountType
        }
    }
    return true
}

async function AlertMissingAccount(Type, Game) {
    document.getElementById("tabview").src = `/gamepage/missingaccount/?game=${Game.Id}&type=${Type}`
    document.querySelector("#tabbutton").remove()
}

async function LoadTitleElements(Game) {
    document.getElementById("gametitle").innerText = Game.LongName
    document.getElementById("developername").innerText = `By ${Game.Developer.Name}`
}

async function LoadPageButtons(Game) {
    const Template = document.querySelector("#tabbutton")
    Template.remove()
    const TabHolder = document.getElementById("tabholder")
    const Tabs = Game.Pages
    var I = 0
    for (const TabName of Tabs) {
        const TabElement = Template.cloneNode(true)
        const PageMeta = await (
            await fetch(`/gamepage/pages/${TabName}/Meta.json`)
        ).json()
        TabElement.querySelector("#buttonlabel").innerText = PageMeta.Name
        TabElement.addEventListener(
            "click",
            function() {
                if (TabElement.classList.contains("selected")) {console.log("already selected"); return}
                document.getElementById("tabview").src = `/gamepage/pages/${TabName}/?game=${Game.Id}`
                for (const Child of TabHolder.children) {Child.classList.remove("selected")}
                TabElement.classList.add("selected")
            }
        )
        if (I == 0) {
            TabElement.click()
        }
        Selected = true
        TabHolder.appendChild(TabElement)
        I++
    }
}

window.addEventListener(
    "load",
    async function() {
        const GameId = QueryParameters["game"];
        const Game = await CoreLauncher.IPC.Send(
            "Main",
            "Games.GetGame",
            GameId
        )
        await LoadTitleElements(Game)
        const MissingAccountType = await CheckRequiredAccounts(Game)
        if (MissingAccountType != true) {await AlertMissingAccount(MissingAccountType, Game); return}
        await LoadPageButtons(Game)
    }
)
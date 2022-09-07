window.addEventListener(
    "load",
    async function() {
        const GameId = QueryParameters["game"];
        const Game = await CoreLauncher.IPC.Send(
            "Main",
            "GetGame",
            GameId
        )
        console.log(Game)
        document.getElementById("gametitle").innerText = Game.LongName
        document.getElementById("developername").innerText = `By ${Game.Developer.Name}`

        const Template = document.querySelector("#tabbutton")
        console.log(Template)
        Template.remove()
        const TabHolder = document.getElementById("tabholder")
        const Tabs = Game.Pages
        Tabs.forEach(TabName => {
            const TabElement = Template.cloneNode(true)
            console.log(TabName)
            const PageMeta = await (
                await fetch(`/gamepage/pages/${TabName}/Meta.json`)
            ).json()
            console.log(PageMeta)
            TabElement.querySelector("#buttonlabel").innerText = PageMeta.Name
            console.log(TabName)
            TabHolder.appendChild(TabElement)
        });
    }
)
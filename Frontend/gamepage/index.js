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
        var I = 0
        for (const TabName of Tabs) {
            console.log(TabName, I)
            const TabElement = Template.cloneNode(true)
            const PageMeta = await (
                await fetch(`/gamepage/pages/${TabName}/Meta.json`)
            ).json()
            TabElement.querySelector("#buttonlabel").innerText = PageMeta.Name
            TabElement.addEventListener(
                "click",
                function() {
                    if (TabElement.classList.contains("selected")) {console.log("already selected"); return}
                    document.getElementById("tabview").src = `/gamepage/pages/${TabName}`
                    for (const Child of TabHolder.children) {Child.classList.remove("selected")}
                    TabElement.classList.add("selected")
                    console.log(TabElement.classList)
                    console.log(TabName)
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
)
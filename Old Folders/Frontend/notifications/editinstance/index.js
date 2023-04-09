window.addEventListener(
    "load",
    async function() {
        const Tabs = [
            {
                Label: "Basic",
                Page: "Basic"
            },
            {
                Label: "Mods",
                Page: "Mods"
            },
            {
                Label: "Advanced",
                Page: "Advanced"
            }
        ]

        const Topbar = document.getElementById("topbar")
        const ContainerFrame = document.getElementById("containerframe")
        const TabTemplate = document.getElementById("containertab")
        TabTemplate.remove()

        var Selected = false
        var SelectedTab = ""
        for (const Tab of Tabs) {
            const TabElement = TabTemplate.cloneNode(true)
            TabElement.innerHTML = `<a>${Tab.Label}</a>`
            TabElement.addEventListener(
                "click",
                async function() {
                    if (SelectedTab == Tab.Page) {
                        p("page already selected")
                        return
                    }
                    SelectedTab = Tab.Page

                    ContainerFrame.src = `/notifications/editinstance/pages/${Tab.Page}/?gameid=${QueryParameters.gameid}&instanceid=${QueryParameters.instanceid}`

                    Topbar.childNodes.forEach(
                        function(Element) {
                            if (!Element.classList) {
                                return
                            }
                            Element.classList.remove("selected")
                        }
                    )

                    TabElement.classList.add("selected")
                }
            )

            Topbar.appendChild(TabElement)
            if (Selected == false) {
                Selected = true
                TabElement.click()
            }
        }
    }
)
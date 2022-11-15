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
                Page: "Basic"
            },
            {
                Label: "Advanced",
                Page: "Basic"
            }
        ]

        const Topbar = document.getElementById("topbar")
        const ContainerFrame = document.getElementById("containerframe")
        const TabTemplate = document.getElementById("containertab")
        TabTemplate.remove()

        var Selected = false
        for (const Tab of Tabs) {
            const TabElement = TabTemplate.cloneNode(true)
            TabElement.innerHTML = `<a>${Tab.Label}</a>`
            TabElement.addEventListener(
                "click",
                async function() {
                    ContainerFrame.src = `/notifications/editinstance/pages/${Tab.Page}/`

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
                TabElement.click()
            }
        }
    }
)
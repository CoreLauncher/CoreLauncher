//#region New instance button
window.addEventListener(
    "load",
    async function() {
        const Button = document.getElementById("newinstancebutton")

        Button.addEventListener(
            "click",
            async function() {
                await CoreLauncher.API.NotificationService.Show(
                    "NewInstance",
                    "/notifications/newinstance/?gameid=" + QueryParameters.gameid,
                    "Creating new instance"
                )
            }
        )
    }
)
//#endregion
//#region Load instances
window.addEventListener(
    "load",
    async function() {
        const InstanceTemplate = document.getElementById("instancetemplate")
        InstanceTemplate.remove()
        const InstancesHolder = document.getElementById("instancesholder")
        const Instances = await CoreLauncher.IPC.Send(
            "Main",
            "Games.Instances.GetInstances",
            {
                GameId: QueryParameters.gameid
            }
        )
        p(Instances)
        for (const Instance of Instances) {
            const InstanceElement = InstanceTemplate.cloneNode(true)
            InstanceElement.querySelector(".name").innerText = Instance.Name
            InstanceElement.addEventListener(
                "load",
                async function() {
                    
                }
            )
            InstancesHolder.appendChild(InstanceElement)
            p(Instance)
        }
    }
)
//#endregion
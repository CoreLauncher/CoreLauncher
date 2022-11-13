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
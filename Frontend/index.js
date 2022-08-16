window.addEventListener(
    "load",
    async function() {
        var DiscordConnected = await CoreLauncher.IPC.Send(
            "Main",
            "AccountConnected",
            "Discord"
        )
        console.log(DiscordConnected)
        if (DiscordConnected == true) {
            location = "/games/"
        } else {
            location = "/welcome/"
        }
    }
)

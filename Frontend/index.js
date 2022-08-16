window.addEventListener(
    "load",
    async function() {
        var DiscordConnected = await CoreLauncher.IPC.Send(
            "Main",
            "AccountConnected",
            "Discord"
        )
        if (DiscordConnected == true) {
            location = "/games/"
        } else {
            location = "/welcome/"
        }
    }
)

window.addEventListener(
    "load",
    async function() {
        var DiscordConnected = await CoreLauncher.IPC.Send(
            "Main",
            "IsAccountConnected",
            "Discord"
        )
        if (DiscordConnected == true) {
            location = "/games/"
        } else {
            location = "/welcome/"
        }
    }
)

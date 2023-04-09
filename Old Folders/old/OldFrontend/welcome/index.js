window.addEventListener(
    "load",
    async function() {
        var DiscordConnected = await CoreLauncher.IPC.Send(
            "Main",
            "Accounts.IsConnected",
            "Discord"
        )
        if (DiscordConnected == true) {
            location = "/"
        }

        var Button = document.getElementById("connectbutton");
        Button.addEventListener(
            "click",
            async function() {
                console.log("Button clicked")
                await CoreLauncher.IPC.Send(
                    "Main",
                    "Accounts.StartFlow",
                    "Discord"
                )
            }
        )
    }
)


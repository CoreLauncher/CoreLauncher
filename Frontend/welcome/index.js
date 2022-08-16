window.addEventListener(
    "load",
    async function() {
        var Button = document.getElementById("connectbutton");
        Button.addEventListener(
            "click",
            async function() {
                console.log("Button clicked")
                CoreLauncher.IPC.Send(
                    "Main",
                    "ConnectAccount",
                    "Discord"
                )
            }
        )

        var Wait = true

        CoreLauncher.IPC.RegisterMessage(
            "AccountConnected",
            async function(Type) {
                console.log(Type)
                if (Type == "Discord") {
                   Wait = false
                }
            }
        )

        while (Wait) {
            await new Promise(r => setTimeout(r, 1000));
        }
        await new Promise(r => setTimeout(r, 1000));
        location = "/"
    }
)


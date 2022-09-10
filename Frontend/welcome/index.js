window.addEventListener(
    "load",
    async function() {
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

        var Wait = true

        CoreLauncher.IPC.RegisterMessage(
            "Accounts.FlowCompleted",
            async function(Type) {
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


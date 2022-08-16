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
    }
)
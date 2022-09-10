window.addEventListener(
    "load",
    async function() {
        await CoreLauncher.IPC.Send(
            "Main",
            "Accounts.EndFlow",
            {
                Type: "MSA",
                Code: QueryParameters.code
            }
        )
        location.href = "/callback/"
    }
)

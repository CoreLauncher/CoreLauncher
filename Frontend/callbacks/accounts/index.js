window.addEventListener(
    "load",
    async function() {
        await CoreLauncher.IPC.Send(
            "Main",
            "Accounts.EndFlow",
            {
                Type: QueryParameters.state,
                Code: QueryParameters.code
            }
        )
    }
)
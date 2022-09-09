window.addEventListener(
    "load",
    async function() {
        console.log(QueryParameters.code)
        await CoreLauncher.IPC.Send(
            "Main",
            "Accounts.EndFlow",
            {
                Type: "MSA",
                Code: QueryParameters.code
            }
        )
    }
)

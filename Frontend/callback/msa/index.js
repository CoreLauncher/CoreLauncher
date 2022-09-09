window.addEventListener(
    "load",
    async function() {
        console.log(QueryParameters.code)
        await CoreLauncher.IPC.Send(
            "Main",
            "AccountCallback",
            {
                Type: "MSA",
                Code: QueryParameters.code
            }
        )
    }
)

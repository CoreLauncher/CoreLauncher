window.addEventListener(
    "load",
    async function() {
        const Info = await CoreLauncher.IPC.Send(
            "Main",
            "Other.GetLatestRelease"
        )
        document.body.innerHTML = `<md-block>${Info.Body}</md-block>`
    }
)
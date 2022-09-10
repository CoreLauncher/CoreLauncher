window.addEventListener(
    "load",
    async function() {
        const Version = await CoreLauncher.IPC.Send(
            "Main",
            "Package.Version"
        )
        document.getElementById("versiondisplay").innerText = `Version ${Version}`
        console.log(Version)
    }
)
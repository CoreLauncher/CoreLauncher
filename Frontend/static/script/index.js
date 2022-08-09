console.log("Loading Core")

window.CoreLauncher = {
    IPC: new OpenIPC("CoreLauncher", "Render"),
}

console.log("Core Loaded!")
console.log("Loading Core")
window.CoreLauncher = {
    IPC: new OpenIPC("CoreLauncher", (document.currentScript || {getAttribute: function() {return undefined}}).getAttribute("IPC") || "Render"),
}

console.log("Core Loaded!")
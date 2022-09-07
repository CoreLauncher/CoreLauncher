console.log("Loading Core")
const urlSearchParams = new URLSearchParams(window.location.search); window.QueryParameters = Object.fromEntries(urlSearchParams.entries());
window.CoreLauncher = {
    IPC: new OpenIPC("CoreLauncher", (document.currentScript || {getAttribute: function() {return undefined}}).getAttribute("IPC") || "Render"),
}

console.log("Core Loaded!")
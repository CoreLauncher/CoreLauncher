console.log("Loading Core")
const urlSearchParams = new URLSearchParams(window.location.search); window.QueryParameters = Object.fromEntries(urlSearchParams.entries());
window.CoreLauncher = {
    IPC: new OpenIPC("CoreLauncher", (document.currentScript || {getAttribute: function() {return undefined}}).getAttribute("IPC") || "Render"),
}
window.p = console.log
CoreLauncher.ExtLink = async function(Link) {
    await CoreLauncher.IPC.Send(
        "Main",
        "Other.ExtLink",
        Link
    )
}

console.log("Core Loaded!")

String.prototype.interpolate = function(params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
}
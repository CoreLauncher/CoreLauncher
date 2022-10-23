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

String.prototype.interpolate = function(params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
}

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//#region context menu
window.addEventListener(
    "load",
    async function() {
        const Menu = document.createElement("div")
        Menu.classList.add("contextmenu")
        document.body.appendChild(Menu)
    }
)
//#endregion
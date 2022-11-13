const IsInIframe = window.self !== window.top
const urlSearchParams = new URLSearchParams(window.location.search); window.QueryParameters = Object.fromEntries(urlSearchParams.entries());
window.p = console.log

import API from "/assets/script/API/index.js"

//#region Mouse pos
if (IsInIframe) {
    window.MousePosition = window.top.MousePosition
    window.addEventListener(
        "mousemove",
        async function(E) {
            const Bound = window.frameElement.getBoundingClientRect()
            MousePosition.X = E.pageX + Bound.left
            MousePosition.Y = E.pageY + Bound.top
        }
    )
} else {
    window.MousePosition = {}
    window.addEventListener(
        "mousemove",
        async function(E) {
            MousePosition.X = E.pageX
            MousePosition.Y = E.pageY
        }
    )
}
//#endregion
//#region Main api
if (IsInIframe) {
    window.CoreLauncher = window.top.CoreLauncher
} else {
    window.CoreLauncher = {
        IPC: new OpenIPC("CoreLauncher", "Render"),
        API: API
    }
    CoreLauncher.ExtLink = async function(Link) {
        await CoreLauncher.IPC.Send(
            "Main",
            "Other.ExtLink",
            Link
        )
    }
}
//#endregion
//#region additional prototypes
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
//#endregion
const CurrentScript = Array.from(document.getElementsByTagName("script")).filter(function(S) {return S.src == import.meta.url})[0]

function getCallerFile(position = 2) {
    const oldPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack)  => stack;
    const stack = new Error().stack;
    Error.prepareStackTrace = oldPrepareStackTrace;
    return stack[position].getFileName();
};

window.require = async function(RequestPath) {
    RequestPath = new URL(RequestPath, getCallerFile()).href
    const Module = await import(RequestPath)
    if (Module.default) {
        return Module.default
    }
    // console.log("No default export found for " + RequestPath)
}


const Main = CurrentScript.dataset.main
document.addEventListener(
    "DOMContentLoaded",
    function() {
        require(Main)
    }
)
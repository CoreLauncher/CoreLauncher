define(
    Export
)

async function Export(require) {
    globalThis.CoreLauncher = {}
    CoreLauncher.ScreenManager = require("ScreenManager")
    console.log("dsa")
    CoreLauncher.ScreenManager.ScanScreens()
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(1000)

    console.log("asd")
    CoreLauncher.ScreenManager.GetScreen("main").Show()
}
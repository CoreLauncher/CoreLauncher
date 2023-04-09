
globalThis.CoreLauncher = {}
CoreLauncher.ScreenManager = await require("./ScreenManager.js")
console.log(CoreLauncher.ScreenManager)
await CoreLauncher.ScreenManager.ScanScreens()
CoreLauncher.ScreenManager.GetScreen("main").Show()

export default ""
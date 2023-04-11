

globalThis.CoreLauncher = {}
CoreLauncher.ScreenManager = await require("./ScreenManager.js")
await CoreLauncher.ScreenManager.ScanScreens()
const deSVG = await require("./lib/desvg.js")
deSVG("img", true)
CoreLauncher.ScreenManager.GetScreen("main").Show()

export default "index"
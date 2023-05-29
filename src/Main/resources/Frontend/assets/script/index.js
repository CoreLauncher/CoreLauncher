
await require("./lib/globals/sleep.js")
await require("./lib/globals/RemoveClassFromChildren.js")
await require("./lib/globals/clamp.js")
globalThis.CoreLauncher = {}
CoreLauncher.ScreenManager = await require("./ScreenManager.js")
CoreLauncher.AccountManager = CoreLauncherManagers.AccountManager
CoreLauncher.DataBase = CoreLauncherManagers.DataBase
CoreLauncher.GameManager = CoreLauncherManagers.GameManager
CoreLauncher.PluginManager = CoreLauncherManagers.PluginManager
CoreLauncher.WindowControl = CoreLauncherManagers.WindowControl
CoreLauncher.OpenGameSettings = await require("./lib/OpenGameSettings.js")
CoreLauncher.OpenSettings = await require("./lib/OpenSettings.js")

await CoreLauncher.ScreenManager.ScanScreens()

const deSVG = await require("./lib/desvg.js")
deSVG("img", true)
await sleep(1000)
CoreLauncher.ScreenManager.GetScreen("main").Show()
await sleep(0.3 * 1000)
document.getElementById("topbar").style.visibility = "visible"

export default "index"

await require("./lib/globals/sleep.js")
await require("./lib/globals/RemoveClassFromChildren.js")
await require("./lib/globals/clamp.js")
await require("./lib/globals/UserFocus.js")

await require("./lib/purify/purify.min.js")

globalThis.CoreLauncher = {}
CoreLauncher.ScreenManager = await require("./ScreenManager.js")
CoreLauncher.AccountManager = CoreLauncherManagers.AccountManager
CoreLauncher.DataBase = CoreLauncherManagers.DataBase
CoreLauncher.GameManager = CoreLauncherManagers.GameManager
CoreLauncher.PluginManager = CoreLauncherManagers.PluginManager
CoreLauncher.TaskManager = CoreLauncherManagers.TaskManager
CoreLauncher.WindowControl = CoreLauncherManagers.WindowControl

CoreLauncher.Settings = {
    OpenGameSettings: await require("./lib/settings/OpenGameSettings.js"),
    OpenSettings: await require("./lib/settings/OpenSettings.js"),
    OpenInstanceSettings: await require("./lib/settings/OpenInstanceSettings.js")
}

CoreLauncher.Properties = {
    Render: await require("./lib/properties/Render.js"),
    Collect: await require("./lib/properties/Collect.js")
}

CoreLauncher.HtmlHelper = {
    CleanString: function(S) {
        return DOMPurify.sanitize(S, {ALLOWED_TAGS:[]})
    },
    CoreLauncherMarkdown: function(S) {
        const Parts = S.split("]extlink(")
        var NewString = ""

        for (const PartIndex in Parts) {
            const Part = Parts[PartIndex]
            const NextPart = Parts[parseInt(PartIndex) + 1]
            if (!NextPart) break

            const SplitPart = Part.split("[")
            const Text = SplitPart[0]
            const LinkText = SplitPart[1]
            const Link = NextPart.split(")")[0]
            NewString += `${Text}<a class="linkappearance" onclick="CoreLauncher.WindowControl.OpenExternal('${Link}')">${LinkText}</a>`
            
        }

        NewString += Parts[Parts.length - 1].split(")")[1]

        return NewString == "undefined" ? S : NewString
    }

}

await CoreLauncher.ScreenManager.ScanScreens()

const deSVG = await require("./lib/desvg.js")
deSVG("img", true)

// await sleep(1000)
CoreLauncher.ScreenManager.GetScreen("main").Show()
// await sleep(0.3 * 1000)
document.getElementById("topbar").style.visibility = "visible"

export default "index"
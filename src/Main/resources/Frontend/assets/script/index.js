define(
    Export
)

function Export(require) {
    

    console.log("a")

    globalThis.CoreLauncher = {}
    CoreLauncher.ScreenManager = require("ScreenManager")
}
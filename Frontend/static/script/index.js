console.log("Loading Core")
import "/static/components/index.js"
let CoreLauncher = {
    IPC: new OpenIPC("CoreLauncher", "Render"),
}
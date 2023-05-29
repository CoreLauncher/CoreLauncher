const Electron = require('electron')
const ContextBridge = Electron.contextBridge
const IPCRenderer = Electron.ipcRenderer

function ReObjectPipe(PipeObject) {
    const TransformedObject = {}

    for (const [Key, Value] of Object.entries(PipeObject)) {
        if (typeof Value === "object") {
            if (Value.PipeType == "function") {
                TransformedObject[Key] = async function(...Args) {
                    return await IPCRenderer.invoke(Value.PipeHandle, ...Args)
                }
            } else {
                TransformedObject[Key] = ReObjectPipe(Value)
            }
        } else {
            TransformedObject[Key] = Value
        }
    }

    return TransformedObject
}

(
    async function() {
        ContextBridge.exposeInMainWorld(
            "CoreLauncherManagers",
            {
                AccountManager: ReObjectPipe(await IPCRenderer.invoke("pipes.accountmanager")),
                DataBase: ReObjectPipe(await IPCRenderer.invoke("pipes.database")),
                GameManager: ReObjectPipe(await IPCRenderer.invoke("pipes.gamemanager")),
                PluginManager: ReObjectPipe(await IPCRenderer.invoke("pipes.pluginmanager")),
                WindowControl: ReObjectPipe(await IPCRenderer.invoke("pipes.windowcontrol")),
            }
        )
    }
)()

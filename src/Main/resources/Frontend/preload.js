const Electron = require('electron')
const ContextBridge = Electron.contextBridge
const IPCRenderer = Electron.ipcRenderer
console.log(Electron)

console.log(IPCRenderer.invoke("pipes.gamemanager"))

console.log("hi")
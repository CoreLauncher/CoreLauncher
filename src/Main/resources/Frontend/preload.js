const Electron = require('electron')
const ContextBridge = Electron.contextBridge
const IPCRenderer = Electron.ipcRenderer
console.log(Electron)

IPCRenderer.send("a")

console.log("hi")
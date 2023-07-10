class WindowControl {
    Close() {
        CoreLauncher.BrowserWindow.close()
    }
    
    Minimize() {
        CoreLauncher.BrowserWindow.minimize()
    }
    
    Maximize() {
        CoreLauncher.BrowserWindow.maximize()
    }
    
    Restore() {
        CoreLauncher.BrowserWindow.restore()
    }
    
    OpenExternal(Url) {
        CoreLauncher.Electron.shell.openExternal(Url)
    }
}

module.exports = WindowControl
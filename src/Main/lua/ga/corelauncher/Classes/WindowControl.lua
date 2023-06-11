local WindowControl = {}

function WindowControl:Close()
    CoreLauncher.BrowserWindow:close()
end

function WindowControl:Minimize()
    CoreLauncher.BrowserWindow:minimize()
end

function WindowControl:Maximize()
    CoreLauncher.BrowserWindow:maximize()
end

function WindowControl:Restore()
    CoreLauncher.BrowserWindow:restore()
end

function WindowControl:OpenExternal(Url) 
    CoreLauncher.Electron.shell:openExternal(Url)
end


return WindowControl
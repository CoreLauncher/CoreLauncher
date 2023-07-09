local WindowControl = Import("ga.corelauncher.Libraries.ClassCreator")(
    "WindowControl",
    function (self)
        
    end,
    {
        Close = function(self)
            CoreLauncher.BrowserWindow:close()
        end,

        Minimize = function(self)
            CoreLauncher.BrowserWindow:minimize()
        end,

        Maximize = function(self)
            CoreLauncher.BrowserWindow:maximize()
        end,

        Restore = function(self)
            CoreLauncher.BrowserWindow:restore()
        end,
        
        OpenExternal = function(self, Url)
            CoreLauncher.Electron.shell:openExternal(Url)
        end
    }
)

return WindowControl
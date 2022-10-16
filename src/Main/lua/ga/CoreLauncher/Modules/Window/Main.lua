CoreLauncher.IPC:RegisterMessage(
    "Window.Minimize",
    function()
        CoreLauncher.Window:Minimize()
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Window.Maximize",
    function()
        local Window = CoreLauncher.Window
        if Window:IsMaximized() then
            CoreLauncher.Window:Unmaximize()
        else
            CoreLauncher.Window:Maximize()
        end
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Window.Close",
    function()
        CoreLauncher.Window:Close()
    end
)
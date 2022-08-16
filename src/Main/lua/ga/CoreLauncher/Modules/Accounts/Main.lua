CoreLauncher.IPC:RegisterMessage(
    "AccountConnected",
    function(Name)
        return CoreLauncher.Accounts:AccountConnected(Name)
    end
)

CoreLauncher.IPC:RegisterMessage(
    "ConnectAccount",
    function (Name)
        return CoreLauncher.Accounts:Connect(Name)
    end
)

CoreLauncher.IPC:RegisterMessage(
    "AccountCallback",
    function (Data)
        CoreLauncher.Accounts:AccountCallback(Data.Type, Data.Data)
        local Window = CoreLauncher.Window
        Window:Focus()
        Window:setAlwaysOnTop(true)
        Window:setAlwaysOnTop(false)
    end
)
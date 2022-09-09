CoreLauncher.IPC:RegisterMessage(
    "IsAccountConnected",
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
        p(Data)
        CoreLauncher.AuthServices:Resolve(Data.Type, Data.Code)
        --CoreLauncher.Accounts:AccountCallback(Data.Type, Data.Data)
        
    end
)

CoreLauncher.IPC:RegisterMessage(
    "GetAccount",
    function (Name)
        return CoreLauncher.Accounts:Get(Name)
    end
)
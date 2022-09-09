CoreLauncher.IPC:RegisterMessage(
    "Accounts.GetAccount",
    function (Name)
        return CoreLauncher.Accounts:Get(Name)
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Accounts.IsConnected",
    function(Name)
        return CoreLauncher.Accounts:IsConnected(Name)
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Accounts.StartFlow",
    function (Name)
        return CoreLauncher.Accounts:StartFlow(Name)
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Accounts.EndFlow",
    function (Data)
        CoreLauncher.Accounts:EndFlow(Data.Type, Data.Code)
    end
)
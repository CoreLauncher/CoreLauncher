local function SelfCall(Obj, Func)
    return function (...)
        Obj[Func](Obj, ...)
    end
end

CoreLauncher.IPC:RegisterMessage(
    "Accounts.StartFlow",
    SelfCall(CoreLauncher.Accounts, "StartFlow")
)

CoreLauncher.IPC:RegisterMessage(
    "Accounts.EndFlow",
    function (Data)
        p(Data)
        CoreLauncher.Accounts:EndFlow(Data.Type, Data.Code)
    end
)
Import("ga.CoreLauncher.Modules.Accounts.Discord")

local function SelfCall(Obj, Func)
    return function (...)
        return Obj[Func](Obj, ...)
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

CoreLauncher.IPC:RegisterMessage(
    "Accounts.Has",
    SelfCall(CoreLauncher.Accounts, "Has")
)
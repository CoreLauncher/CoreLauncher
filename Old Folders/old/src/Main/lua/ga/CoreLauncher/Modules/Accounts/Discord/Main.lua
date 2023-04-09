CoreLauncher.IPC:RegisterMessage(
    "Accounts.Discord.GetAccount",
    function (Name)
        return Import("ga.CoreLauncher.Libraries.Discord").GetUser()
    end
)
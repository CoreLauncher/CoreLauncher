const PipeObject = Import("ga.corelauncher.Libraries.PipeObject")

CoreLauncher.IPCMain.handle(
    "pipes.accountmanager",
    function () {
        return PipeObject("AccountManager", CoreLauncher.AccountManager)
    }
)
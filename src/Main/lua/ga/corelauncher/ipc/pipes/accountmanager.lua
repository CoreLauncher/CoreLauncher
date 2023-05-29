local PipeObject = Import("ga.corelauncher.Helpers.PipeObject")

CoreLauncher.IPCMain:handle(
    "pipes.accountmanager",
    function ()
        return PipeObject(CoreLauncher.AccountManager)
    end
)
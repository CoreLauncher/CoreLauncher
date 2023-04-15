local PipeObject = Import("ga.corelauncher.Helpers.PipeObject")

CoreLauncher.IPCMain:handle(
    "pipes.database",
    function ()
        return PipeObject(CoreLauncher.DataBase)
    end
)
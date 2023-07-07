local PipeObject = Import("ga.corelauncher.Libraries.PipeObject")

CoreLauncher.IPCMain:handle(
    "pipes.database",
    function ()
        return PipeObject("DataBase", CoreLauncher.DataBase)
    end
)
local PipeObject = Import("ga.corelauncher.Libraries.PipeObject")

CoreLauncher.IPCMain:handle(
    "pipes.windowcontrol",
    function ()
        return PipeObject(CoreLauncher.WindowControl)
    end
)
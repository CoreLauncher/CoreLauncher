local PipeObject = Import("ga.corelauncher.Libraries.PipeObject")

CoreLauncher.IPCMain:handle(
    "pipes.gamemanager",
    function ()
        return PipeObject(CoreLauncher.GameManager)
    end
)
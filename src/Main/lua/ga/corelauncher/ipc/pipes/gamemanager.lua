local PipeObject = Import("ga.corelauncher.Libraries.PipeObject")

CoreLauncher.IPCMain:handle(
    "pipes.gamemanager",
    function ()
        return PipeObject("GameManager", CoreLauncher.GameManager)
    end
)
local PipeObject = Import("ga.corelauncher.Helpers.PipeObject")

CoreLauncher.IPCMain:handle(
    "pipes.gamemanager",
    function ()
        --return PipeObject(CoreLauncher.GameManager)
    end
)
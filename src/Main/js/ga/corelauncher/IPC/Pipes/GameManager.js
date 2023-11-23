const PipeObject = await Import("ga.corelauncher.Libraries.PipeObject")

CoreLauncher.IPCMain.handle(
    "pipes.gamemanager",
    function () {
        return PipeObject("GameManager", CoreLauncher.GameManager)
    }
)
const PipeObject = await Import("ga.corelauncher.Libraries.PipeObject")

CoreLauncher.IPCMain.handle(
    "pipes.windowcontrol",
    function () {
        return PipeObject("WindowControl", CoreLauncher.WindowControl)
    }
)
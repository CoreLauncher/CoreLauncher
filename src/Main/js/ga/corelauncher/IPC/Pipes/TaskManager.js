const PipeObject = await Import("ga.corelauncher.Libraries.PipeObject")

CoreLauncher.IPCMain.handle(
    "pipes.taskmanager",
    function () {
        return PipeObject("TaskManager", CoreLauncher.TaskManager)
    }
)
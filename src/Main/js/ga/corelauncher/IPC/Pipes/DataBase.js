const PipeObject = await Import("ga.corelauncher.Libraries.PipeObject")

CoreLauncher.IPCMain.handle(
    "pipes.database",
    function () {
        return PipeObject("DataBase", CoreLauncher.DataBase)
    }
)
const PipeObject = await Import("ga.corelauncher.Libraries.PipeObject")

CoreLauncher.IPCMain.handle(
    "pipes.pluginmanager",
    function () {
        return PipeObject("PluginManager", CoreLauncher.PluginManager)
    }
)
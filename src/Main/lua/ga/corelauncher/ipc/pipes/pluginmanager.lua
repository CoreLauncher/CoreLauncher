local PipeObject = Import("ga.corelauncher.Libraries.PipeObject")

CoreLauncher.IPCMain:handle(
    "pipes.pluginmanager",
    function ()
        return PipeObject("PluginManager", CoreLauncher.PluginManager)
    end
)
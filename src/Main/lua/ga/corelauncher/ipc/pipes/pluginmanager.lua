local PipeObject = Import("ga.corelauncher.Libraries.PipeObject")

CoreLauncher.IPCMain:handle(
    "pipes.pluginmanager",
    function ()
        return PipeObject(CoreLauncher.PluginManager)
    end
)
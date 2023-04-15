local PipeObject = Import("ga.corelauncher.Helpers.PipeObject")

CoreLauncher.IPCMain:handle(
    "pipes.pluginmanager",
    function ()
        return PipeObject(CoreLauncher.PluginManager)
    end
)
local PipeObject = Import("ga.corelauncher.Helpers.PipeObject")
local WindowControl = Import("ga.corelauncher.Helpers.WindowControl")

CoreLauncher.IPCMain:handle(
    "pipes.windowcontrol",
    function ()
        return PipeObject(WindowControl)
    end
)
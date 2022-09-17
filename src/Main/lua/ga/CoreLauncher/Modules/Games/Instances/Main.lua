CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.GetInstanceProperties",
    function(Game)
        local Properties = CoreLauncher.Games[Game].Functions.GetInstanceProperties()
        Properties.InstanceName = {
            Label = "Instance Name",
            Type = "string",
            Default = "Instance",
            Index = -1
        }
        return Properties
    end
)
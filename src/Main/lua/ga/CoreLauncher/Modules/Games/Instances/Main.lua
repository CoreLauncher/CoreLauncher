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

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.GetInstances",
    function (Game)
        local Instances = CoreLauncher.Config:GetKey(
            string.format(
                "Games.%s.Instances"
                Game
            )
        )
        if Instances == nil then
            Instances = {}
            CoreLauncher.Config:SetKey(
                string.format(
                    "Games.%s.Instances"
                    Game
                ),
                {}
            )
        end
        return Instances
    end
)
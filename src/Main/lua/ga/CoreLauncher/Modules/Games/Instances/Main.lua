Import("ga.CoreLauncher.Modules.Games.Instances.Modifications")

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
                "Games.%s.Instances",
                Game
            )
        )
        if Instances == nil then
            Instances = {}
            CoreLauncher.Config:SetKey(
                string.format(
                    "Games.%s.Instances",
                    Game
                ),
                {}
            )
        end
        Instances = table.deepcopy(Instances)
        local Default = CoreLauncher.Games[Game].Functions.GetDefaultInstances()
        for Index, Instance in pairs(Default) do
            table.insert(Instances, Instance)
        end
        for Index, Instance in pairs(Instances) do
            Instance.Comment = CoreLauncher.Games[Game].Functions.GetInstanceComment(Instance)
            Instance.Properties.InstanceName = Instance.Name
        end
        return Instances
    end
)

local GetUUID = require("uuid4").getUUID
CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.NewInstance",
    function (Game)
        local NewInstance = {
            Id = GetUUID(),
            Name = "New Instance",
            Removable = true,
            Editable = true,
            Properties = {},
            Modifications = {}
        }
        local Properties = CoreLauncher.Games[Game].Functions.GetInstanceProperties()
        for PropertyKey, Property in pairs(Properties) do
            NewInstance.Properties[PropertyKey] = Property.Default
        end
        CoreLauncher.Config:SetKey(
            string.format(
                "Games.%s.Instances.%s",
                Game,
                NewInstance.Id
            ),
            NewInstance
        )
        return NewInstance.Id
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.DeleteInstance",
    function (Data)
        local Game = Data.Game
        CoreLauncher.Config:SetKey(
            string.format(
                "Games.%s.Instances.%s",
                Game,
                Data.Id
            ),
            nil
        )
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.SetProperties",
    function (Data)
        local Game = Data.Game
        local Properties = Data.Properties
        local InstanceId = Data.Id

        CoreLauncher.Config:SetKey(
            string.format(
                "Games.%s.Instances.%s.Properties",
                Game,
                InstanceId
            ),
            Properties
        )
    end
)
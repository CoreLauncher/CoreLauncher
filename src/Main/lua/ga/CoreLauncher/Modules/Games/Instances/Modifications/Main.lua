CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.Modifications.GetModSources",
    function(Game)
        local Sources = {}
        for ModSource, ModSourceInfo in pairs(CoreLauncher.Games[Game].Functions.ModSources) do
            table.insert(Sources, ModSource)
        end
        return Sources
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.Modifications.Search",
    function(Data)
        local Game = Data.Game
        local ModSource = Data.Source
        local Query = Data.Query
        local Instance = Data.Instance
        local SearchProperties = Data.Properties

        return CoreLauncher.Games[Game].Functions.ModSources[ModSource].Search(Query, Properties, Instance, Data.Page)
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.Modifications.AddToInstance",
    function(Data)
        p(Data)
        local Game = Data.Game
        local InstanceId = Data.InstanceId
        local ModData = Data.ModData
        local Instance
        for Index, InstanceL in pairs(CoreLauncher.Config:GetKey(string.format("Games.%s.Instances", Game))) do
            if InstanceL.Id == InstanceId then
                Instance = InstanceL
                break
            end
        end
    end
)
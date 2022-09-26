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
        local Game = Data.Game
        local InstanceId = Data.InstanceId
        local ModData = Data.ModData
        local Instance = CoreLauncher.Config:GetKey(
            string.format(
                "Games.%s.Instances.%s",
                Game,
                InstanceId
            )
        )
        if ModData.Version == "latest" then
            ModData.Version = CoreLauncher.Games[Game].Functions.ModSources[ModData.Source].GetLatestModVersion(Instance, ModData.Id).id
        end
        CoreLauncher.Config:SetKey(
            string.format(
                "Games.%s.Instances.%s.Modifications.Enabled.%s",
                Game,
                InstanceId,
                ModData.Id
            ),
            ModData
        )
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.Modifications.ListMods",
    function(Data)
        local Game = Data.Game
        local InstanceId = Data.InstanceId
        local Instance = CoreLauncher.Config:GetKey(
            string.format(
                "Games.%s.Instances.%s",
                Game,
                InstanceId
            )
        )
        local function GetFor(ModList)
            local Return = {}
            for Index, Mod in pairs(ModList) do
                Mod = table.deepcopy(Mod)
                Mod.Versions = CoreLauncher.Games[Game].Functions.ModSources[Mod.Source].GetVersionsSupportedForInstance(Instance, Mod.Id)
                table.insert(Return, Mod)
            end
            return Return
        end
        local Mods = {
            Enabled = GetFor(Instance.Modifications.Enabled),
            Disabled = GetFor(Instance.Modifications.Disabled)
        }
        return Mods
    end
)
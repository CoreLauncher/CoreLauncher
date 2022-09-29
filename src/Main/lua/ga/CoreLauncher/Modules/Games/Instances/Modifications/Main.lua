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

local GetUUID = require("uuid4").getUUID
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
        ModData.Enabled = true
        ModData.UUID = GetUUID()
        if ModData.Version == "latest" then
            local VersionData = CoreLauncher.Games[Game].Functions.ModSources[ModData.Source].GetLatestModVersion(Instance, ModData.Id)
            ModData.Version = VersionData.Id
            ModData.Url = VersionData.Url
            ModData.Hash = VersionData.Hash
        end
        CoreLauncher.Config:SetKey(
            string.format(
                "Games.%s.Instances.%s.Modifications.%s",
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
        local Mods = {}
        for Index, Mod in pairs(Instance.Modifications) do
            Mod = table.deepcopy(Mod)
            Mod.Versions = CoreLauncher.Games[Game].Functions.ModSources[Mod.Source].GetVersionsSupportedForInstance(Instance, Mod.Id)
            Mods[Mod.Id] = Mod
        end
        return Mods
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.Modifications.SetModVersionId",
    function(Data)
        local Game = Data.Game
        local InstanceId = Data.InstanceId
        local ModData = Data.ModData
        local ModId = Data.ModId

        local Mod = CoreLauncher.Config:GetKey(
            string.format(
                "Games.%s.Instances.%s.Modifications.%s",
                Game,
                InstanceId,
                ModId
            )
        )
        
        Mod.Version = ModData.VersionId
        Mod.Hash = ModData.Hash
        Mod.Url = ModData.Url

        CoreLauncher.Config:SetKey(
            string.format(
                "Games.%s.Instances.%s.Modifications.%s",
                Game,
                InstanceId,
                ModId
            ),
            Mod
        )
        
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.Modifications.SetModState",
    function(Data)
        local Game = Data.Game
        local InstanceId = Data.InstanceId
        local ModId = Data.ModId
        local State = Data.State
        
        CoreLauncher.Config:SetKey(
            string.format(
                "Games.%s.Instances.%s.Modifications.%s.Enabled",
                Game,
                InstanceId,
                ModId
            ),
            State
        )
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.Modifications.RemoveMod",
    function(Data)
        local Game = Data.Game
        local InstanceId = Data.InstanceId
        local ModId = Data.ModId
        
        CoreLauncher.Config:SetKey(
            string.format(
                "Games.%s.Instances.%s.Modifications.%s",
                Game,
                InstanceId,
                ModId
            ),
            nil
        )
    end
)
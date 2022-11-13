local Instances = {}

local CreateUUID = require("uuid4").getUUID

function Instances.GetVersions(GameId, Type, Value)
    return CoreLauncher.Games[GameId].Functions.Versioning[Type](Value)
end

function Instances.CreateInstance(GameId, Data)
    if Data.Name == "" then
        Data.Name = "New instance"
    end
    local Instance = {
        Name = Data.Name,
        DefaultProperties = {
            LoaderType = Data.LoaderType,
            GameVersion = Data.GameVersion,
            LoaderVersion = Data.LoaderVersion
        },
        Properties = {},
        Modifications = {},
        Editable = true,
        Removeable = true,
        Id = CreateUUID()
    }
    p(Instance)
    
    CoreLauncher.Config:SetKey(
        string.format(
            "Games.%s.Instances.%s",
            GameId,
            Instance.Id
        ),
        Instance
    )
end

function Instances.GetInstances(GameId)
    local Instances = {}

    local SavedInstances = CoreLauncher.Config:GetKey(
        "Games.%s.Instances",
        GameId
    ) or {}

    for _, Instance in pairs(SavedInstances) do
        for PropertyKey, PropertyGetter in pairs(CoreLauncher.Games[GameId].Functions.Properties) do
            local PropertyData = PropertyGetter()
            if Instance.Properties[PropertyKey] == nil then
                Instance.Properties[PropertyKey] = PropertyData.Default
            end
        end
        table.insert(Instances, Instance)
    end

    return Instances
end

return Instances
CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.GetVersions",
    function (Data)
        return CoreLauncher.API.Games.Instances.GetVersions(Data.GameId, Data.Type, Data.Value)
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.CreateInstance",
    function (Data)
        return CoreLauncher.API.Games.Instances.CreateInstance(Data.GameId, Data.Data)
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.GetInstances",
    function (Data)
        return CoreLauncher.API.Games.Instances.GetInstances(Data.GameId)
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.GetInstance",
    function (Data)
        return CoreLauncher.API.Games.Instances.GetInstance(Data.GameId, Data.InstanceId)
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.GetAvailableProperties",
    function (Data)
        return CoreLauncher.API.Games.Instances.GetAvailableProperties(Data.GameId)
    end
)

CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.SetProperty",
    function (Data)
        return CoreLauncher.API.Games.Instances.SetProperty(Data.GameId, Data.InstanceId, Data.PropertyType, Data.PropertyKey, Data.PropertyValue)
    end
)
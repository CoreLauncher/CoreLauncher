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
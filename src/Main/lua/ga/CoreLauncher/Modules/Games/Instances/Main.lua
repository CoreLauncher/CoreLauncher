CoreLauncher.IPC:RegisterMessage(
    "Games.Instances.GetInstanceProperties",
    function(Game)
        return CoreLauncher.Games[Game].Functions.GetInstanceProperties()
    end
)
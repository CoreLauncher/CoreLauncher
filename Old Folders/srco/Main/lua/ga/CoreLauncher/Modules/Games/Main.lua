Import("ga.CoreLauncher.Modules.Games.Instances")

CoreLauncher.IPC:RegisterMessage(
    "Games.List",
    CoreLauncher.API.Games.ListInfo
)
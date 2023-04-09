CoreLauncher.IPC:RegisterMessage(
    "Package.Version",
    function(Name)
        return TypeWriter.LoadedPackages["CoreLauncher"].Package.Version
    end
)

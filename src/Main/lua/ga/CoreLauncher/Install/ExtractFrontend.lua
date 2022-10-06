local FS = require("fs")
return function ()
    if CoreLauncher.Dev then
        return
    end

    local FrontEndFolder = CoreLauncher.ApplicationData .. "/App/"
    local FrontEndZip = CoreLauncher.ApplicationData .. "/App.zip"
    local VersionFile = CoreLauncher.ApplicationData .. "/AppVersion.txt"
    local CoreLauncherVersion = TypeWriter.LoadedPackages["CoreLauncher"].Package.Version

    local WrittenVersion = FS.readFileSync(VersionFile)
    if WrittenVersion ~= CoreLauncherVersion then
        TypeWriter.Logger.Warn("Found frontend version is outdated")
        TypeWriter.Logger.Warn("Deleting old frontend")
        p(FrontEndFolder)
        require("coro-fs").rmrf(FrontEndFolder)
        FS.writeFileSync(FrontEndZip, TypeWriter.LoadedPackages["CoreLauncher"].Resources["/App.zip"])
        Import("ga.CoreLauncher.Libraries.Unzip")(FrontEndZip, CoreLauncher.ApplicationData)
        FS.renameSync(CoreLauncher.ApplicationData .. "/Frontend/", FrontEndFolder)
        FS.writeFileSync(VersionFile, CoreLauncherVersion)
    end
end
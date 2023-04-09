local FS = require("fs")
return function ()
    if FS.existsSync(CoreLauncher.ApplicationData .. "/favicon.ico") then
        return
    end
    local Favicon = TypeWriter.LoadedPackages["CoreLauncher"].Resources["/favicon.ico"]
    FS.writeFileSync(CoreLauncher.ApplicationData .. "/favicon.ico", Favicon)
end
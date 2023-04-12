local PluginManager = {}

local FS = TypeWriter:JsRequire("fs-extra")

function PluginManager:LoadPlugins(PluginsFolder)
    TypeWriter.Logger:Information("Loading plugins from " .. PluginsFolder)
    local Files = FS:readdirSync(PluginsFolder)
    print(Files)
    
end

return PluginManager
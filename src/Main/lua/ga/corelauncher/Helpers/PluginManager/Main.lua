local PluginManager = {}

local FS = TypeWriter:JsRequire("fs-extra")

function PluginManager:LoadPlugins(PluginsFolder)
    TypeWriter.Logger:Information("Loading plugins")
    local Files = FS:readdirSync(PluginsFolder)
    Inspect(Files)
end

return PluginManager
local PluginManager = {}

local FS = TypeWriter:JsRequire("fs-extra")

function PluginManager:LoadPlugins(PluginsFolder)
    TypeWriter.Logger:Information("Loading plugins from " .. PluginsFolder)
    local Files = FS:readdirSync(PluginsFolder)
    
    for FileName in js.of(Files) do
        TypeWriter.Logger:Information("Loading plugin " .. FileName)
        local FilePath = PluginsFolder .. "/" .. FileName
        local Plugin = TypeWriter:LoadFile(FilePath)
        if Plugin.Entrypoints.CoreLauncherPlugin then
            TypeWriter.Logger:Information("Plugin " .. FileName .. " is a CoreLauncher plugin")
            local PluginData = TypeWriter:LoadEntrypoint(Plugin.Id, "CoreLauncherPlugin")
            self.Plugins[Plugin.Id] = PluginData
        end
    end
end
end

return PluginManager
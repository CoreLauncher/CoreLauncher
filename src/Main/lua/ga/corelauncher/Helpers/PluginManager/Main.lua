local PluginManager = {}
PluginManager.Plugins = {}

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

function PluginManager:ListGames()
    local Games = {}

    for PluginId, Plugin in pairs(self.Plugins) do
        for _, Game in pairs(Plugin.Games) do
            Games[Game.Id] = Game
        end
    end

    return Games
end

return PluginManager    local AccountTypes = {}

    for PluginId, Plugin in pairs(self.Plugins) do
        if not Plugin.AccountTypes then goto continue end
        for _, AccountType in pairs(Plugin.AccountTypes) do
            AccountTypes[AccountType.Id] = AccountType
        end
        ::continue::
    end

    return AccountTypes
end

--#region Plugin Information
function PluginManager:ListPluginIds()
    local PluginIds = {}

    for PluginId, Plugin in pairs(self.Plugins) do
        table.insert(PluginIds, PluginId)
    end

    return PluginIds
end

function PluginManager:GetPluginInformation(PluginId)
    local Plugin = self.Plugins[PluginId]

    return {
        Name = Plugin.Name,
        Creator = Plugin.Creator,
        CreatorLink = Plugin.CreatorLink,
        Source = Plugin.Source,
        Version = Plugin.Version,
        Description = Plugin.Description
    }
end

function PluginManager:GetPluginIcon(PluginId)
    local IconPath = TypeWriter.ResourceManager:GetFilePath(self.Plugins[PluginId].Icon)
    return FS:readFileSync(IconPath, "utf8")
end

function PluginManager:GetPluginIconBase64(PluginId)
    local IconPath = TypeWriter.ResourceManager:GetFilePath(self.Plugins[PluginId].Icon)
    return Base64Img:base64Sync(IconPath)
end
--#endregion

return PluginManager

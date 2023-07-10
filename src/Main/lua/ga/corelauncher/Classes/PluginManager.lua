local Base64Img = TypeWriter.JavaScript:Require("base64-img")
local FS = TypeWriter.JavaScript:Require("fs-extra")

local PluginManager = Import("ga.corelauncher.Libraries.ClassCreator")(
    "PluginManager",
    function(self)
        self.Plugins = {}
    end,
    {
        LoadPlugins = function(self, PluginsFolder)
            TypeWriter.Logger:Information("Loading plugins from " .. PluginsFolder)
            local Files = FS:readdirSync(PluginsFolder)

            for _, FileName in ipairs(Files) do
                TypeWriter.Logger:Information("Loading plugin " .. FileName)
                local FilePath = PluginsFolder .. "/" .. FileName
                local Plugin = TypeWriter.LoadFile(FilePath)
                if Plugin.Entrypoints.CoreLauncherPlugin then
                    TypeWriter.Logger.Information("Plugin " .. FileName .. " is a CoreLauncher plugin")
                    -- local PluginData = TypeWriter.LoadEntrypointAsync(Plugin.Id, "CoreLauncherPlugin"):await()
                    -- self.Plugins[Plugin.Id] = PluginData
                end
            end
        end,

        ListGames = function(self)
            local Games = {}

            for PluginId, Plugin in pairs(self.Plugins) do
                if not Plugin.Games then goto continue end
                for _, Game in ipairs(Plugin.Games) do
                    Games[Game.Id] = Game
                end
                ::continue::
            end

            return Games
        end,

        ListAccountTypes = function(self)
            local AccountTypes = {}

            for PluginId, Plugin in pairs(self.Plugins) do
                if not Plugin.AccountTypes then goto continue end
                for _, AccountType in ipairs(Plugin.AccountTypes) do
                    AccountTypes[AccountType.Id] = AccountType
                end
                ::continue::
            end

            return AccountTypes
        end,

        --#region Plugin Information
        ListPluginIds = function(self)
            local PluginIds = {}

            for PluginId, Plugin in pairs(self.Plugins) do
                table.insert(PluginIds, PluginId)
            end

            return PluginIds
        end,

        GetPluginInformation = function(self, PluginId)
            return self.Plugins[PluginId]
        end,

        GetPluginIcon = function(self, PluginId)
            local IconPath = TypeWriter.ResourceManager:GetFilePath(self:GetPluginInformation(PluginId).Icon)
            return FS:readFileSync(IconPath, "utf8")
        end,

        GetPluginIconBase64 = function(self, PluginId)
            local IconPath = TypeWriter.ResourceManager:GetFilePath(self:GetPluginInformation(PluginId).Icon)
            return Base64Img:base64Sync(IconPath)
        end,
        --#endregion


    }
)

return PluginManager

local Data = {}

local QueryEncode = require("querystring").stringify
local FS = require("fs")
local CFS = require("coro-fs")
local PathLib = require("path")
local ModrinthBaseUrl = string.format(
    "https://api.modrinth.com/%s",
    "v2"
)
local CurseforgeBaseUrl = "https://cfproxy.fly.dev/v1" -- https://github.com/bmpm-mc/cfproxy

local GameDir = string.format(
    "%s/CoreLauncher/Games/MinecraftJava/",
    TypeWriter.ApplicationData
)
FS.mkdirSync(GameDir .. "Assets/")
FS.mkdirSync(GameDir .. "Assets/indexes")
FS.mkdirSync(GameDir .. "Assets/log_configs")
FS.mkdirSync(GameDir .. "Assets/objects")
FS.mkdirSync(GameDir .. "Assets/skins")
FS.mkdirSync(GameDir .. "Libraries")
FS.mkdirSync(GameDir .. "Clients")
FS.mkdirSync(GameDir .. "Instances")
FS.mkdirSync(GameDir .. "ModCache")

local function GenerateModrinthFacets(Facets)
    local NewData = {}
    for _, FacetBlock in pairs(Facets) do
        local NewFacetBlock = {}
        for _, Facet in pairs(FacetBlock) do
            table.insert(
                NewFacetBlock,
                string.format(
                    "%s:%s",
                    Facet[1],
                    Facet[2]
                )
            )
        end
        table.insert(NewData, NewFacetBlock)
    end
    return require("json").encode(NewData)
end

local function JsFormat(Str, Replacements)
    for ReplaceKey, Replacement in pairs(Replacements) do
        Str = string.gsub(
            Str,
            string.format(
                "${%s}", ReplaceKey
            ),
            Replacement
        )
    end
    return Str
end

local Schemas = {
    Modrinth = {
        Mod = function (Mod)
            local Categories = {}
            for Index, Category in pairs(Mod.categories) do
                table.insert(Categories, Category:sub(1, 1):upper() .. Category:sub(2))
            end
            return {
                Source = "Modrinth",
                Id = Mod.project_id,
                Slug = Mod.slug,
                Name = Mod.title,
                Author = Mod.author,
                Description = Mod.description,
                Icon = Mod.icon_url,
                Licence = Mod.licence,
                Link = "https://modrinth.com/" .. Mod.project_type .. "/" .. Mod.slug,
                Envoirments = {
                    Client = Mod.client_side,
                    Server = Mod.server_side
                },
                Categories = Categories
            }
        end,
        Version = function (Version)
            return {
                Published = Version.date_published,
                Downloads = Version.downloads,
                Id = Version.id,
                Name = Version.name,
                Tag = Version.version_number,
                Url = Version.files[1].url,
                Hash = Version.files[1].hashes.sha1
            }
        end
    },
    Curseforge = {
        Mod = function (Mod)
            local Categories = {}
            for Index, Category in pairs(Mod.categories) do
                table.insert(
                    Categories,
                    Category.name
                )
            end
            return {
                Source = "Curseforge",
                Id = Mod.id,
                Slug = Mod.slug,
                Name = Mod.name,
                Author = Mod.authors[1].name,
                Description = Mod.summary,
                Icon = Mod.logo.url,
                Licence = "Unknown",
                Link = Mod.links.websiteUrl,
                Envoirments = {
                    Client = "Unknown",
                    Server = "Unknown"
                },
                Categories = Categories
            }
        end,
        Version = function (Version)
            return {
                Published = Version.fileDate,
                Downloads = Version.downloadCount,
                Id = Version.id,
                Name = Version.displayName,
                Tag = Version.displayName,
                Url = Version.downloadUrl,
                Hash = Version.hashes[1].value
            }
        end
    },
    Url = {
        Mod = function (Mod)
            return {
                Source = "Url",
                Id = require("base64").encode(Mod.Url),
                Slug = Mod.Url,
                Name = Mod.Url,
                Author = "A url",
                Description = "From a url",
                Icon = "https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/link.svg",
                Licence = "Unknown",
                Link = Mod.Url,
                Envoirments = {
                    Client = "Unknown",
                    Server = "Unknown"
                },
                Categories = {}
            }
        end,
        Version = function (Version)
            return {
                Published = "",
                Downloads = 0,
                Id = "",
                Name = "File",
                Tag = "File",
                Url = Version.Url,
                Hash = require("md5").sumhexa(Version.Url)
            }
        end
    }
}

local RuleOS = (
    {
        win32 = "windows",
        linux = "linux",
        darwin = "osx"
    }
)[TypeWriter.Os]
local function RulesPass(Rules)
    if Rules == nil then
        return true
    end
    for _, Rule in pairs(Rules) do
        if Rule.os then
            local Pass = true
            if Rule.os.name ~= RuleOS and Rule.os.name ~= nil and Pass then
                Pass = false
            end
            if Rule.os.arch ~= ({x86_64 = "x86"})[require("uv").os_uname().machine] and Rule.os.arch ~= nil and Pass then
                Pass = false
            end
            if Rule.os.version ~= ({win32 = "^10\\."})[TypeWriter.Os] and Rule.os.version and Pass then
                Pass = false
            end
            return Pass
        end
    end
    return false
end

local function GetClientData(Type, InstanceVersion)
    local Getters = {
        Vanilla = function (Version)
            for Index, Version in pairs(Data.Cache.VersionManifest.versions) do
                if Version.id == InstanceVersion then
                    VersionManifest = Version
                    break
                end
            end
            local _, VersionData = CoreLauncher.Http.JsonRequest(
                "GET",
                VersionManifest.url
            )
            return VersionData
        end,
        Fabric = function (Version)
            
        end,
        Quilt = function (Version)
            local LoaderVersion = (
                {
                    CoreLauncher.Http.JsonRequest(
                        "GET",
                        "https://meta.quiltmc.org/v3/versions/loader/" .. Version
                    )
                }
            )[2][1].loader.version

            local _, VersionData = CoreLauncher.Http.JsonRequest(
                "GET",
                "https://meta.quiltmc.org/v3/versions/loader/" .. Version .. "/" .. LoaderVersion .. "/profile/json"
            )
            return VersionData
        end
    }
    local function Inherit(From, To)
        for Key, Value in pairs(From) do
            if To[Key] == nil then
                if type(Value) == "table" then
                    To[Key] = {}
                    Inherit(Value, To[Key])
                else
                    To[Key] = Value
                end
            else
                if type(To[Key]) == "table" and type(Value) == "table" then
                    if To[Key][1] ~= nil then
                        for _, ValueValue in pairs(Value) do
                            table.insert(To[Key], ValueValue)
                        end
                    else
                        Inherit(Value, To[Key])
                    end
                end
            end
        end
    end
    local LoaderData = Getters[Type](InstanceVersion)
    local InheritsFrom = LoaderData.inheritsFrom
    if InheritsFrom then
        local VanillaData = Getters["Vanilla"](InheritsFrom)
        Inherit(VanillaData, LoaderData)
    end
    return LoaderData
end

local function DownloadAssets(Url, Id)
    CoreLauncher.ProgressBar:SetStage("Downloading assets")
    CoreLauncher.ProgressBar:Reset()
    local _, AssetIndex = CoreLauncher.Http.JsonRequest(
        "GET",
        Url
    )
    local ObjectFolder = GameDir .. "Assets/objects/"
    local Current = 1
    local All = table.count(AssetIndex.objects)
    for _, Asset in pairs(AssetIndex.objects) do
        local Prefix = Asset.hash:sub(1, 2)
        local Hash = Asset.hash
        local AssetFolder = ObjectFolder .. Prefix .. "/"
        FS.mkdirSync(AssetFolder)
        local AssetPath = AssetFolder .. Hash
        if FS.existsSync(AssetPath) == false then
            local Url = string.format(
                "%s/%s/%s",
                "http://resources.download.minecraft.net",
                Prefix,
                Hash
            )
            TypeWriter.Logger.Info("Downloading " .. Url)
            local _, AssetData = CoreLauncher.Http.Request(
                "GET",
                Url
            )
            FS.writeFileSync(AssetPath, AssetData)
            CoreLauncher.ProgressBar:SetProgress(Current, All)
            CoreLauncher.ProgressBar:Update()
        end
        Current = Current + 1
    end
    FS.writeFileSync(GameDir .. "Assets/indexes/" .. Id .. ".json", require("json").encode(AssetIndex))
    return GameDir .. "Assets/"
end

local function DownloadLogConfig(Data)
    local Argument
    local FileData = Data.file
    local LogFile = GameDir .. "Assets/log_configs/" .. FileData.id
    if Data.type == "log4j2-xml" then
        FS.writeFileSync(LogFile, TypeWriter.LoadedPackages["CoreLauncher"].Resources["/better-client-1.12.xml"])

    else
        if FS.existsSync(LogFile) == false then
            local _, File = CoreLauncher.Http.Request(
                "GET",
                FileData.url
            )
            FS.writeFileSync(LogFile, File)
        end
        Argument = JsFormat(
            Data.argument,
            {
                path = PathLib.resolve(LogFile)
            }
        )
    end
    
    return Argument
end

local function DownloadLibraries(Libraries, ClassPath)
    CoreLauncher.ProgressBar:SetStage("Downloading libraries")
    CoreLauncher.ProgressBar:Reset()
    local Count = 1
    local All = #Libraries
    for _, Library in pairs(Libraries) do
        CoreLauncher.ProgressBar:SetProgress(Count, All)
        CoreLauncher.ProgressBar:Update()
        Count = Count + 1
        local Url
        local Path
        local DirPath
        if RulesPass(Library.rules) then
            if Library.downloads then
                local FileInfo = Library.downloads.artifact
                Url = FileInfo.url
                Path = GameDir .. "Libraries/" .. FileInfo.path
                DirPath = PathLib.resolve(Path, "..")
            else
                local Split = Library.name:split(":")
                local Author = Split[1]
                local Package = Split[2]
                local Version = Split[3]
                local LibUrl = Library.url
                if Package == "hashed" and Author == "org.quiltmc" then
                    Author = "net.fabricmc"
                    Package = "intermediary"
                    LibUrl = "https://maven.fabricmc.net/"
                end
                local FileName = string.format(
                    "%s-%s.jar",
                    Package,
                    Version
                )
                local PathName = string.format(
                    "%s/%s/%s",
                    table.concat(Author:split("."), "/"),
                    Package,
                    Version
                )
                Url = string.format(
                    "%s%s/%s",
                    LibUrl,
                    PathName,
                    FileName
                )
                DirPath = GameDir .. "Libraries/" .. PathName .. "/"
                Path = DirPath .. "/" .. FileName
            end
        end
        if Url then
            CFS.mkdirp(DirPath)
            if FS.existsSync(Path) == false then
                TypeWriter.Logger.Info("Downloading library %s", Url)
                local _, FileData = CoreLauncher.Http.Request(
                    "GET",
                    Url
                )
                FS.writeFileSync(Path, FileData)
            end
            table.insert(ClassPath, PathLib.resolve(Path))
        end
    end
end

local function DownloadClient(FileInfo, Name, ClassPath)
    CoreLauncher.ProgressBar:SetStage("Downloading client")
    CoreLauncher.ProgressBar:Reset()
    CoreLauncher.ProgressBar:Update()
    local FilePath = GameDir .. "Clients/" .. Name .. ".jar"
    if FS.existsSync(FilePath) == false then
        local _, FileData = CoreLauncher.Http.Request(
            "GET",
            FileInfo.url
        )
        FS.writeFileSync(FilePath, FileData)
    end
    table.insert(ClassPath, FilePath)
    CoreLauncher.ProgressBar:SetProgress(1, 1)
    return FilePath
end

local function DownloadMods(Mods, ModFolder)
    local ModCacheFolder = GameDir .. "ModCache/"
    CoreLauncher.ProgressBar:SetStage("Downloading mods")
    CoreLauncher.ProgressBar:Reset()
    local All = table.count(Mods)
    local Count = 1
    for ModId, ModInfo in pairs(Mods) do
        CoreLauncher.ProgressBar:SetProgress(Count, All)
        CoreLauncher.ProgressBar:Update()
        local File
        if FS.existsSync(ModCacheFolder .. ModInfo.Hash) then
            File = FS.readFileSync(ModCacheFolder .. ModInfo.Hash)
        else
            if ModInfo.Url == nil then
                TypeWriter.Logger.Error("Mod %s (ID:%s) is missing a download url", ModInfo.Name, ModInfo.Id)
            else
                TypeWriter.Logger.Info("Downloading modfile %s", ModInfo.Url)
                local _, FileData = CoreLauncher.Http.Request(
                    "GET",
                    ModInfo.Url
                )
                FS.writeFileSync(ModCacheFolder .. ModInfo.Hash, FileData)
                File = FileData
            end
        end
        local FilePath = ModFolder .. ModInfo.Hash .. ".jar" 
        if File ~= nil then
            FS.writeFileSync(FilePath, File)
        else
            TypeWriter.Logger.Error("Skipping file write for %s", FilePath)
        end
        Count = Count + 1
    end
    for FileName in FS.scandirSync(ModFolder) do
        local FileHash = PathLib.basename(FileName, ".jar")
        local Found = false
        for _, Mod in pairs(Mods) do
            if Mod.Hash == FileHash then
                if Mod.Enabled == true then
                    Found = true
                    break
                else
                end
            end
        end
        if Found == false then
            local File = ModFolder .. FileName
            TypeWriter.Logger.Info("Removing removed mod file %s", File)
            FS.unlinkSync(File)
        end
    end
end

local function GetAuthData()
    local XBLToken
    local UHS
    do
        local _, Response = CoreLauncher.Http.JsonRequest(
            "POST",
            "https://user.auth.xboxlive.com/user/authenticate",
            {
                {"Content-Type", "application/json"},
                {"Accept", "application/json"}
            },
            {
                ["Properties"] = {
                    ["AuthMethod"] = "RPS",
                    ["SiteName"] = "user.auth.xboxlive.com",
                    ["RpsTicket"] = "d=" .. CoreLauncher.Accounts:GetAccount("MSA").AccessToken.access_token
                },
                ["RelyingParty"] = "http://auth.xboxlive.com",
                ["TokenType"] = "JWT"
            }
        )
        XBLToken = Response.Token
        UHS = Response.DisplayClaims.xui[1].uhs
    end

    local XSTSToken
    do
        local _, Response = CoreLauncher.Http.JsonRequest(
            "POST",
            "https://xsts.auth.xboxlive.com/xsts/authorize",
            {
                {"Content-Type", "application/json"},
                {"Accept", "application/json"}
            },
            {
                ["Properties"] = {
                    ["SandboxId"] = "RETAIL",
                    ["UserTokens"] = {
                        XBLToken
                    }
                },
                ["RelyingParty"] = "rp://api.minecraftservices.com/",
                ["TokenType"] = "JWT"
            }
        )
        XSTSToken = Response.Token
    end

    local MojangToken
    do
        local ExpiresAt = CoreLauncher.Config:GetKey("Games.MinecraftJava.AccessToken.ExpiresAt")
        local _, Response = CoreLauncher.Http.JsonRequest(
            "POST",
            "https://api.minecraftservices.com/authentication/login_with_xbox",
            {
                {"Content-Type", "application/json"}
            },
            {
                ["identityToken"] = string.format(
                    "XBL3.0 x=%s;%s",
                    UHS,
                    XSTSToken
                ),
                ["ensureLegacyEnabled"] = true
            }
        )
        MojangToken = Response.access_token
        CoreLauncher.Config:SetKey(
            "Games.MinecraftJava.AccessToken",
            {
                At = os.time(),
                ExpiresAt = Response.expires_in + os.time() - 2000,
                Token = Response.access_token
            }
        )
    end

    local UserName
    local UUID
    do
        local _, Response = CoreLauncher.Http.JsonRequest(
            "GET",
            "https://api.minecraftservices.com/minecraft/profile",
            {
                {"Content-Type", "application/json"},
                {"Authorization", "Bearer " .. MojangToken}
            }
        )
        UserName = Response.name
        UUID = Response.id
    end

    return {
        UserName = UserName,
        UUID = UUID,
        Token = MojangToken
    }
end

local function ParseArguments(ArgumentList, Data)
    local Return = {}
    for _, Argument in pairs(ArgumentList) do
        if type(Argument) == "string" then
            table.insert(Return, JsFormat(Argument, Data))
        else
            if RulesPass(Argument.rules) then
                if type(Argument.value) == "table" then
                    for _, Value in pairs(Argument.value) do
                        table.insert(Return, JsFormat(Value, Data))
                    end
                else
                    table.insert(Return, JsFormat(Argument.value, Data))
                end
            end
        end
    end
    return Return
end

local function InsertIntoTable(Value, Tbl)
    if type(Value) == "table" then
        for _, TblValue in pairs(Value) do
            table.insert(Tbl, TblValue)
        end
    else
        table.insert(Tbl, Value)
    end
end

Data.Cache = {}
Data.Cache.VersionManifest = ({CoreLauncher.Http.JsonRequest("GET", "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")})[2]
Data.Cache.ModVersions = {
    Modrinth = {},
    Curseforge = {}
}

local CurseforgeModLoaderTypes = {
    Forge = 1,
    Fabric = 4,
    Quilt = "[4, 5]", --Quilt is 5 but we also want 4 for fabric
}

Data.Info = {
    Id = "MinecraftJava",
    Name = "Minecraft",
    LongName = "Minecraft: Java edition",
    Description = "Minecraft is a sandbox video game created by Swedish game developer Markus Persson and later developed by Mojang.",
    Icon = "http://localhost:9874/static/image/games/minecraft/icon.png",
    Banner = "http://localhost:9874/static/image/games/minecraft/banner.png",
    Developer = {
        Name = "Mojang",
        Website = "https://www.minecraft.net/en-us/"
    },
    Pages = {
        "PlayPage",
        "InstancePage",
        "MinecraftSkinsPage"
    },
    RequiresAccounts = {
        "MSA"
    },
    Instanced = true
}
Data.Functions = {
    LaunchGame = function (Instance)
        local InstanceVersion = Instance.Properties.Version
        local VersionData = GetClientData(Instance.Properties.ModType, InstanceVersion)
        local ClassPath = {}
        local AssetDir = DownloadAssets(VersionData.assetIndex.url, VersionData.assetIndex.id)
        local LogArg = DownloadLogConfig(VersionData.logging.client)
        DownloadLibraries(VersionData.libraries, ClassPath)
        DownloadClient(VersionData.downloads.client, VersionData.id, ClassPath)
        FS.mkdirSync(GameDir .. "Instances/" .. Instance.Id)
        FS.mkdirSync(GameDir .. "Instances/" .. Instance.Id .. "/mods")
        local BinDir = GameDir .. "bin/"
        FS.mkdirSync(BinDir)
        DownloadMods(Instance.Modifications, GameDir .. "Instances/" .. Instance.Id .. "/mods/")
        local AuthData = GetAuthData()
        local FormattedClassPath = {}
        for _, Path in pairs(ClassPath) do
            table.insert(FormattedClassPath, PathLib.resolve(Path))
        end
        local ArgumentParameters = {
            auth_player_name = AuthData.UserName,
            version_name = VersionData.id,
            game_directory = PathLib.resolve(GameDir .. "Instances/" .. Instance.Id .. "/"),
            assets_root = AssetDir,
            assets_index_name = VersionData.assets,
            auth_uuid = AuthData.UUID,
            auth_access_token = AuthData.Token,
            clientid = "",
            auth_xuid = "",
            user_type = "msa",
            version_type = VersionData.type,

            natives_directory = ".",
            launcher_name = "CoreLauncher",
            launcher_version = TypeWriter.LoadedPackages["CoreLauncher"].Package.Version,
            classpath = table.concat(FormattedClassPath, ({[true] = ";", [false] = ":"})[TypeWriter.Os == "win32"])
        }
        local ParsedArguments = {
            Game = ParseArguments(VersionData.arguments.game, ArgumentParameters),
            JVM = ParseArguments(VersionData.arguments.jvm, ArgumentParameters)
        }
        
        local Arguments = {}
        InsertIntoTable(ParsedArguments.JVM, Arguments)
        InsertIntoTable(LogArg, Arguments)
        InsertIntoTable("-Xmx" .. math.floor(Instance.Properties.Memory) .. "G", Arguments)
        InsertIntoTable("-XX:+UnlockExperimentalVMOptions", Arguments)
        InsertIntoTable("-XX:+UseG1GC", Arguments)
        InsertIntoTable("-XX:G1NewSizePercent=20", Arguments)
        InsertIntoTable("-XX:G1ReservePercent=20", Arguments)
        InsertIntoTable("-XX:MaxGCPauseMillis=50", Arguments)
        InsertIntoTable("-XX:G1HeapRegionSize=32M", Arguments)
        InsertIntoTable(VersionData.mainClass, Arguments)
        InsertIntoTable(ParsedArguments.Game, Arguments)
        local Result, Error = require("coro-spawn")(
            "java",
            {
                args = Arguments,
                stdio = {
                    process.stdin.handle,
                    true,
                    process.stderr.handle
                },
                cwd = ArgumentParameters.game_directory
            }
        )
        CoreLauncher.Game.IsRunning = true
        CoreLauncher.Game.RunningId = "MinecraftJava"
        CoreLauncher.Game.Process = Result
        coroutine.wrap(function ()
            for LogMessage in Result.stdout.read do
                for _, Line in pairs(LogMessage:Split("\n")) do
                    local SplitMessage = Line:split(" ")
                    local LogLine
                    if SplitMessage[1]:sub(1, 1) == "[" then
                        table.remove(SplitMessage, 1)
                        LogLine = table.concat(SplitMessage, " ")
                    else
                        LogLine = Line
                    end
                    TypeWriter.Logger.Info("Game (MinecraftJava) > %s", LogLine)
                end
            end
            Result.waitExit()
            CoreLauncher.Game.IsRunning = false
            CoreLauncher.Game.RunningId = ""
            CoreLauncher.Game.Process = nil
            TypeWriter.Logger.Info("Game closed")
        end)()
    end,
    GetInstanceProperties = function ()
        local Properties = {}
        do --Version
            local Versions = {}
            for Index, VersionData in pairs(Data.Cache.VersionManifest.versions) do
                if VersionData.type == "release" or VersionData.type == "snapshot" then
                    table.insert(Versions, VersionData.id)                    
                end
            end
            Properties.Version = {
                Label = "Minecraft Version",
                Type = "table",
                Values = Versions,
                Default = Data.Cache.VersionManifest.latest.release,
                Index = 1
            }
        end
        do -- ModType
            local ModTypes = {
                "Vanilla",
                --"Fabric",
                "Quilt",
                --"Forge",
                --"OptiFine"
            }
            Properties.ModType = {
                Label = "Mod loader",
                Type = "table",
                Values = ModTypes,
                Default = ModTypes[1],
                Index = 2
            }
        end
        do -- Memory
            Properties.Memory = {
                Label = "Memory (Gigabytes)",
                Type = "number",
                Default = 4,
                Clamp = {
                    Min = 1,
                    Max = 32
                },
                Index = 3
            }
        end
        return Properties
    end,
    GetInstanceComment = function (Instance)
        local Comment = Instance.Properties.ModType .. " " .. Instance.Properties.Version
        return Comment
    end,
    GetDefaultInstances = function ()
        return {
            {
                Id = "LatestRelease",
                Name = "Latest Release",
                Removable = false,
                Editable = false,
                Properties = {
                    Version = Data.Cache.VersionManifest.latest.release,
                    ModType = "Vanilla",
                    Memory = 4
                },
                Modifications = {}
            }
        }
    end,
    Files = {
        Import = function (File)
            local ImportsFolder = GameDir .. "Imports/"
            FS.mkdirSync(ImportsFolder)
            local ImportId = string.random(64)
            local ImportFolder = GameDir .. "Imports/" .. ImportId
            FS.mkdirSync(ImportFolder)
            local ImportFile = ImportFolder .. "/Import.tar"
            FS.writeFileSync(ImportFile, File)
            Import("ga.CoreLauncher.Libraries.Unzip")(ImportFile, ImportFolder)
            local function Dispose()
                CFS.rmrf(ImportFolder)
            end
            local ExtractedFolder
            for _, FileName in pairs(FS.readdirSync(ImportFolder)) do
                if FileName ~= "Import.tar" then
                    ExtractedFolder = ImportFolder .. "/" .. FileName .. "/"
                    break
                end
            end
            if not ExtractedFolder then
                TypeWriter.Logger.Error("Could not find unpacked folder")
                Dispose()
                return
            end
            local FileData = FS.readFileSync(ExtractedFolder .. "/InstanceData.json")
            if not FileData then
                TypeWriter.Logger.Error("Could not read file of imported pack")
                Dispose()
                return
            end
            local InstanceData = require("json").decode(FileData)
            InstanceData.Id = require("uuid4").getUUID()
            CoreLauncher.Config:SetKey(
                string.format(
                    "Games.%s.Instances.%s",
                    "MinecraftJava",
                    InstanceData.Id
                ),
                InstanceData
            )
            Dispose()
        end,
        Export = function (Instance, Server)
            local ExportsFolder = GameDir .. "Exports/"
            FS.mkdirSync(ExportsFolder)
            local ExportId = string.random(64)
            local ExportFolder = GameDir .. "Exports/" .. ExportId
            FS.mkdirSync(ExportFolder)
            if Server then
                
            else
                FS.writeFileSync(
                    ExportFolder .. "/InstanceData.json",
                    require("json").encode(Instance)
                )
            end
            local ExportFile = ExportsFolder .. ExportId .. ".tar"
            local Result = require("coro-spawn")(
                "tar",
                {
                    args = {
                        "cf", ExportId .. ".tar", ExportId
                    },
                    cwd = ExportsFolder,
                    stdio = {
                        process.stdin.handle,
                        process.stdout.handle,
                        process.stderr.handle
                    }
                }
            )
            Result.waitExit()
            local FileData = "data:@file/x-tar;base64," .. require("base64").encode(FS.readFileSync(ExportFile))
            FS.unlinkSync(ExportFile)
            CFS.rmrf(ExportFolder)
            return FileData
        end
    },
    ModSources = {
        Modrinth = {
            GetSearchProperties = function ()
                local SearchProperties = {}
            end,
            Search = function (Query, Properties, Instance, Page)
                local Facets = {
                    {
                        {"project_type", "mod"}
                    },
                    {
                        {"versions", Instance.Properties.Version}
                    }
                }
                local ModType = Instance.Properties.ModType
                local LoaderFacet = {
                    {"categories", ModType:lower()}
                }
                if ModType == "Quilt" then
                    table.insert(
                        LoaderFacet,
                        {"categories", "fabric"}
                    )
                end
                table.insert(Facets, LoaderFacet)
                local Data = {error = "meilisearch_error"}
                while Data.error == "meilisearch_error" do
                    local _, ResponseData = CoreLauncher.Http.JsonRequest(
                        "GET",
                        ModrinthBaseUrl .. "/search?" .. QueryEncode(
                            {
                                query = Query,
                                limit = 20,
                                facets = GenerateModrinthFacets(Facets),
                                offset = (Page - 1) * 20
                            }
                        )
                    )
                    Data = ResponseData
                end
                
                local ReturnData = {
                    HitCount = #Data.hits,
                    TotalHitCount = Data.total_hits,
                    Limit = Data.limit,
                    Offset = Data.offset,
                    PageCount = math.ceil(Data.total_hits / 20),
                    Hits = {}
                }
                for Index, Hit in pairs(Data.hits) do
                    table.insert(
                        ReturnData.Hits,
                        Schemas.Modrinth.Mod(Hit)
                    )
                end
                return ReturnData
            end,
            GetLatestModVersion = function (Instance, ModId)
                local Version = Data.Functions.ModSources.Modrinth.GetVersionsSupportedForInstance(Instance, ModId)[1]
                return Version
            end,
            GetVersionsSupportedForInstance = function (Instance, ModId)
                local Versions = {}
                local VersionData
                if Data.Cache.ModVersions.Modrinth[ModId] then
                    VersionData = Data.Cache.ModVersions.Modrinth[ModId]
                else
                    local Response, GottenData = CoreLauncher.Http.JsonRequest(
                        "GET",
                        string.format(
                            "%s/project/%s/version",
                            ModrinthBaseUrl,
                            ModId
                        )
                    )
                    Data.Cache.ModVersions.Modrinth[ModId] = GottenData
                    VersionData = GottenData
                end
                
                for Index, Version in pairs(VersionData) do
                    local ModType = Instance.Properties.ModType
                    local GameVersion = Instance.Properties.Version

                    local CorrectVersion = table.search(Version.game_versions, GameVersion) ~= nil

                    local CorrectLoader = false
                    if ModType == "Quilt" then
                        CorrectLoader = table.search(Version.loaders, "quilt") ~= nil or table.search(Version.loaders, "fabric")
                    else
                        CorrectLoader = table.search(Version.loaders, Instance.Properties.ModType:lower()) ~= nil
                    end

                    if CorrectVersion and CorrectLoader then
                        table.insert(
                            Versions,
                            Schemas.Modrinth.Version(Version)
                        )
                    end
                end
                return Versions
            end
        },
        Curseforge = {
            GetSearchProperties = function ()
                local SearchProperties = {}
            end,
            Search = function (Query, Properties, Instance, Page)
                local Response, Data = CoreLauncher.Http.JsonRequest(
                    "GET",
                    CurseforgeBaseUrl .. "/mods/search?" .. QueryEncode(
                        {
                            gameId = 432,
                            modLoaderType = CurseforgeModLoaderTypes[Instance.Properties.ModType],
                            gameVersion = Instance.Properties.Version,
                            sortField = 2,
                            sortOrder = "desc",
                            pageSize = 20,
                            searchFilter = Query,
                            index = (Page - 1) * 20
                        }
                    )
                )
                if Data == nil then
                    p(Response)
                end

                local ReturnData = {
                    HitCount = #Data.data,
                    TotalHitCount = Data.pagination.totalCount,
                    Limit = Data.pagination.resultCount,
                    Offset = Data.pagination.index,
                    PageCount = math.ceil(Data.pagination.totalCount / 20),
                    Hits = {}
                }
                for Index, Hit in pairs(Data.data) do
                    table.insert(
                        ReturnData.Hits,
                        Schemas.Curseforge.Mod(Hit)
                    )
                end
                return ReturnData
            end,
            GetLatestModVersion = function (Instance, ModId)
                local Version = Data.Functions.ModSources.Curseforge.GetVersionsSupportedForInstance(Instance, ModId)[1]
                p(Version)
                return Version
            end,
            GetVersionsSupportedForInstance = function (Instance, ModId)
                local Response, Data = CoreLauncher.Http.JsonRequest(
                    "GET",
                    string.format(
                        "%s/mods/%s/files?%s",
                        CurseforgeBaseUrl,
                        ModId,
                        QueryEncode(
                            {
                                gameVersion	= Instance.Properties.Version,
                                modLoaderType = CurseforgeModLoaderTypes[Instance.Properties.ModType]
                            }
                        )
                    )
                )

                local Versions = {}
                for _, Version in pairs(Data.data) do
                    table.insert(
                        Versions,
                        Schemas.Curseforge.Version(Version)
                    )
                end
                return Versions
            end
        },
        Url = {
            GetSearchProperties = function ()
                local SearchProperties = {}
            end,
            Search = function (Query, Properties, Instance, Page)
                local ReturnData = {
                    HitCount = 0,
                    TotalHitCount = 0,
                    Limit = 20,
                    Offset = 0,
                    PageCount = 1,
                    Hits = {}
                }

                if #Query == 0 then
                    return ReturnData
                end
                local ParsedUrl = require("url").parse(Query)
                if ParsedUrl.host == nil then
                    return ReturnData
                end
                
                
                table.insert(
                    ReturnData.Hits,
                    Schemas.Url.Mod(
                        {
                            Url = Query
                        }
                    )
                )
                ReturnData.HitCount = 1
                ReturnData.TotalHitCount = 1
                return ReturnData
            end,
            GetLatestModVersion = function (Instance, ModId)
                local Version = Data.Functions.ModSources.Url.GetVersionsSupportedForInstance(Instance, ModId)[1]
                p(Version)
                return Version
            end,
            GetVersionsSupportedForInstance = function (Instance, ModId)
                local Versions = {}
                table.insert(
                    Versions,
                    Schemas.Url.Version(
                        {
                            Url = require("base64").decode(ModId)
                        }
                    )
                )
                return Versions
            end
        }
    }
}
return Data
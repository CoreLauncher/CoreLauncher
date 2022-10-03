local Data = {}

local QueryEncode = require("querystring").stringify
local FS = require("fs")
local CFS = require("coro-fs")
local PathLib = require("path")
local ModrinthBaseUrl = string.format(
    "https://api.modrinth.com/%s",
    "v2"
)
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
        if RulesPass(Library.rules) then
            if Library.downloads then
                local FileInfo = Library.downloads.artifact
                local Path = GameDir .. "Libraries/" .. FileInfo.path
                local DirPath = PathLib.resolve(Path, "..")
                CFS.mkdirp(DirPath)
                if FS.existsSync(Path) == false then
                    local _, FileData = CoreLauncher.Http.Request(
                        "GET",
                        FileInfo.url
                    )
                    FS.writeFileSync(Path, FileData)
                end
                table.insert(ClassPath, PathLib.resolve(Path))
            else
                local Split = Library.name:split(":")
                local Author = Split[1]
                local Package = Split[2]
                local Version = Split[3]
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
                local Url = string.format(
                    "%s%s/%s",
                    Library.url,
                    PathName,
                    FileName
                )
                local FilePath = GameDir .. "Libraries/" .. PathName .. "/" .. FileName
                if FS.existsSync(FilePath) == false then
                    local _, File = CoreLauncher.Http.Request(
                        "GET",
                        Url
                    )
                    CFS.mkdirp(GameDir .. "Libraries/" .. PathName .. "/")
                    FS.writeFileSync(FilePath, File)
                end
                table.insert(ClassPath, PathLib.resolve(FilePath))
            end
        end
    end
end

local function DownloadClient(FileInfo, Name, ClassPath)
    CoreLauncher.ProgressBar:SetStage("Downloading client")
    CoreLauncher.ProgressBar:Reset()
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
    for ModId, ModInfo in pairs(Mods) do
        local File
        if FS.existsSync(ModCacheFolder .. ModInfo.Hash) then
            File = FS.readFileSync(ModCacheFolder .. ModInfo.Hash)
        else
            local _, FileData = CoreLauncher.Http.Request(
                "GET",
                ModInfo.Url
            )
            FS.writeFileSync(ModCacheFolder .. ModInfo.Hash, FileData)
            File = FileData
        end
        FS.writeFileSync(ModFolder .. ModInfo.Hash .. ".jar", File)
    end
    for FileName in FS.scandirSync(ModFolder) do
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
    Modrinth = {}
}

Data.Info = {
    Id = "MinecraftJava",
    Name = "Minecraft",
    LongName = "Minecraft: Java edition",
    Description = "Minecraft is a sandbox video game created by Swedish game developer Markus Persson and later developed by Mojang.",
    Icon = "https://lh3.googleusercontent.com/R74PW5uRF3klb1oz6OSsjEO-Wbhc_tISRrdjRrVtLWRbdMfOr8gd-nHBLF-4c4HifLNWl6gz2N8zk4jtb0KO=s400",
    Banner = "https://www.minecraft.net/content/dam/games/minecraft/key-art/Xbox_Minecraft_WildUpdate_Main_.Net_1170x500.jpg",
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
            game_directory = GameDir .. "Instances/" .. Instance.Id .. "/",
            assets_root = AssetDir,
            assets_index_name = VersionData.assets,
            auth_uuid = AuthData.UUID,
            auth_access_token = AuthData.Token,
            clientid = "",
            auth_xuid = "",
            user_type = "MSA",
            version_type = VersionData.type,

            natives_directory = BinDir,
            launcher_name = "CoreLauncher",
            launcher_version = TypeWriter.LoadedPackages["CoreLauncher"].Package.Version,
            classpath = table.concat(FormattedClassPath, ";")
        }
        local ParsedArguments = {
            Game = ParseArguments(VersionData.arguments.game, ArgumentParameters),
            JVM = ParseArguments(VersionData.arguments.jvm, ArgumentParameters)
        }
        
        local Arguments = {}
        InsertIntoTable(ParsedArguments.JVM, Arguments)
        InsertIntoTable(LogArg, Arguments)
        InsertIntoTable(VersionData.mainClass, Arguments)
        InsertIntoTable(ParsedArguments.Game, Arguments)
        local Result, Error = require("coro-spawn")(
            "java.exe",
            {
                args = Arguments,
                stdio = {
                    process.stdin.handle,
                    true, --process.stdout.handle,
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
                    table.remove(SplitMessage, 1)
                    TypeWriter.Logger.Info("Game (MinecraftJava) > %s", table.concat(SplitMessage, " "))
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
                }
            }
        }
    end,
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
                
                if Data.hits == nil then
                    p(Data)
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
            end,
            GetModById = function (ModId)
                local Response, Data = CoreLauncher.Http.JsonRequest(
                    "GET",
                    string.format(
                        "%s/project/%s",
                        ModrinthBaseUrl,
                        ModId
                    )
                )
                return ModSchemas.Modrinth.Mod(Data)
            end
        }
    }
}
return Data
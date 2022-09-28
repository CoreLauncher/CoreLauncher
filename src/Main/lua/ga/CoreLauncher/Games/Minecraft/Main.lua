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
                Tag = Version.version_number
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
            if Rule.os.name == RuleOS then
                return true
            end
        end
    end
    return false
end

local function DownloadAssets(Url, Id)
    local _, AssetIndex = CoreLauncher.Http.JsonRequest(
        "GET",
        Url
    )
    local ObjectFolder = GameDir .. "Assets/objects/"
    local Current = 1
    local All = Asset
    for _, Asset in pairs(AssetIndex.objects) do
        local Prefix = Asset.hash:sub(1, 2)
        local Hash = Asset.hash
        local AssetFolder = ObjectFolder .. Prefix .. "/"
        FS.mkdirSync(AssetFolder)
        local AssetPath = AssetFolder .. Hash
        if FS.existsSync(AssetPath) == false then
            local _, AssetData = CoreLauncher.Http.Request(
                "GET",
                string.format(
                    "%s/%s/%s",
                    "http://resources.download.minecraft.net",
                    Prefix,
                    Hash
                )
            )
            FS.writeFileSync(AssetPath, AssetData)
        end 
    end
    FS.writeFileSync(GameDir .. "Assets/indexes/" .. Id .. ".json", require("json").encode(AssetIndex))
    return GameDir .. "Assets/"
end

local function DownloadLogConfig(Data)
    local FileData = Data.file
    local LogFile = GameDir .. "Assets/log_configs/" .. FileData.id
    local _, File = CoreLauncher.Http.Request(
        "GET",
        FileData.url
    )
    FS.writeFileSync(LogFile, File)
    return JsFormat(
        Data.argument,
        {
            path = PathLib.resolve(LogFile)
        }
    )
end

local function DownloadLibraries(Libraries, ClassPath)
    for _, Library in pairs(Libraries) do
        if RulesPass(Library.rules) then
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
            table.insert(ClassPath, Path)
        end
    end
end

local function DownloadClient(FileInfo, Name, ClassPath)
    p(FileInfo)
    local FilePath = GameDir .. "Clients/" .. Name .. ".jar"
    if FS.existsSync(FilePath) == false then
        local _, FileData = CoreLauncher.Http.Request(
            "GET",
            FileInfo.url
        )
        FS.writeFileSync(FilePath, FileData)
    end
    table.insert(ClassPath, FilePath)
    return FilePath
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
        p(Argument)
        if type(Argument) == "string" then
            table.insert(Return, JsFormat(Argument, Data))
        else
        end
    end
    p(Return)
    return Return
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
        p(Instance)
        local InstanceVersion = Instance.Properties.Version
        local VersionManifest
        for Index, Version in pairs(Data.Cache.VersionManifest.versions) do
            if Version.id == InstanceVersion then
                VersionManifest = Version
                break
            end
        end
        local Response, VersionData = CoreLauncher.Http.JsonRequest(
            "GET",
            VersionManifest.url
        )
        p(VersionData)
        local ClassPath = {}
        local AssetDir = DownloadAssets(VersionData.assetIndex.url, VersionData.assetIndex.id)
        local LogArg = DownloadLogConfig(VersionData.logging.client)
        DownloadLibraries(VersionData.libraries, ClassPath)
        DownloadClient(VersionData.downloads.client, VersionData.id, ClassPath)
        FS.mkdirSync(GameDir .. "Instances/" .. Instance.Id)
        local BinDir = GameDir .. "bin/"
        FS.mkdirSync(BinDir)
        local AuthData = GetAuthData()
        local FormattedClassPath = {}
        for _, Path in pairs(ClassPath) do
            table.insert(FormattedClassPath, PathLib.resolve(Path))
        end
        local ArgumentParameters = {
            auth_player_name = AuthData.UserName,
            version_name = VersionData.id,
            game_directory = GameDir .. "Instances/" .. Instance.Id,
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
        local Arguments = {
            Game = ParseArguments(VersionData.arguments.game, ArgumentParameters),
            JVM = ParseArguments(VersionData.arguments.jvm, ArgumentParameters)
        }
        p({table.unpack(Arguments.JVM),
        LogArg, VersionData.mainClass,
        table.unpack(Arguments.Game)})
        local Result, Error = require("coro-spawn")(
            "java.exe",
            {
                args = {
                    table.unpack(Arguments.JVM),
                    LogArg, VersionData.mainClass,
                    table.unpack(Arguments.Game)
                },
                stdio = {
                    process.stdin.handle,
                    process.stdout.handle,
                    process.stderr.handle
                }
            }
        )
        p(Error)
        Result.waitExit()
        p("don")
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
                "Fabric",
                "Quilt",
                "Forge",
                "OptiFine"
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
                local Response, Data = CoreLauncher.Http.JsonRequest(
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
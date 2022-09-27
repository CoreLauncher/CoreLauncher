local Data = {}

local QueryEncode = require("querystring").stringify
local ModrinthBaseUrl = string.format(
    "https://api.modrinth.com/%s",
    "v2"
)

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
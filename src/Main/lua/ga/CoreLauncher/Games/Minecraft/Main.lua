local Data = {}

local QueryEncode = require("querystring").stringify
local ModrinthBaseUrl = string.format(
    "https://api.modrinth.com/%s/",
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

Data.Cache = {}
Data.Cache.VersionManifest = ({CoreLauncher.Http.JsonRequest("GET", "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")})[2]

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
        if Instance.Editable == false then
            Comment = Comment .. " (Not editable)"
        end
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
                p(Instance)
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
                    ModrinthBaseUrl .. "search?" .. QueryEncode(
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
                    local Categories = {}
                    for Index, Category in pairs(Hit.categories) do
                        table.insert(Categories, Category:sub(1, 1):upper() .. Category:sub(2))
                    end
                    table.insert(
                        ReturnData.Hits,
                        {
                            Source = "Modrinth",
                            Id = Hit.project_id,
                            Slug = Hit.slug,
                            Name = Hit.title,
                            Author = Hit.author,
                            Description = Hit.description,
                            Icon = Hit.icon_url,
                            Licence = Hit.licence,
                            Link = "https://modrinth.com/" .. Hit.project_type .. "/" .. Hit.slug,
                            Envoirments = {
                                Client = Hit.client_side,
                                Server = Hit.server_side
                            },
                            Categories = Categories
                        }
                    )
                end
                return ReturnData
            end,
            GetLatestModVersion = function (Instance, ModId)
                
            end
        }
    }
}
return Data
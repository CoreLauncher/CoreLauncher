local Data = {}
Data.Id = "MinecraftJava"

Data.Cache = {}
Data.Cache.VersionManifest = ({CoreLauncher.Http.JsonRequest("GET", "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")})[2]
Data.Cache.QuiltGameVersions = ({CoreLauncher.Http.JsonRequest("GET", "https://meta.quiltmc.org/v3/versions/game")})[2]

Data.Info = {
    Name = "Minecraft",
    LongName = "Minecraft: Java Edition",
    Description = "Minecraft is a sandbox video game created by Swedish game developer Markus Persson and later developed by Mojang.",
    Icon = "http://localhost:9874/assets/image/games/minecraft/icon.png",
    Banner = "http://localhost:9874/assets/image/games/minecraft/banner.png",
    Developer = {
        Name = "Mojang",
        Website = "https://www.minecraft.net/en-us/"
    },
    Accounts = {
        "MSA"
    },
    Instanced = true
}
Data.Functions = {
    Versioning = {
        LoaderTypes = function ()
            return {
                {
                    Name = "Vanilla",
                    Beta = false,
                    Id = "Vanilla"
                },
                {
                    Name = "Quilt",
                    Beta = false,
                    Id = "Quilt"
                }
            }
        end,
        GameVersions = function (LoaderType)
            local Versions = {}
            if LoaderType == "Vanilla" then
                for _, Version in pairs(Data.Cache.VersionManifest.versions) do
                    if Version.complianceLevel == 1 then
                        table.insert(
                            Versions,
                            {
                                Name = Version.id,
                                Beta = Version.type ~= "release",
                                Id = {
                                    Loader = LoaderType,
                                    GameVersion = Version.id
                                }
                            }
                        )
                    end
                end
            elseif LoaderType == "Quilt" then
                for _, Version in pairs(Data.Cache.QuiltGameVersions) do
                    table.insert(
                        Versions,
                        {
                            Name = Version.version,
                            Beta = not Version.stable,
                            Id = {
                                Loader = LoaderType,
                                GameVersion = Version.version
                            }
                        }
                    )
                end
            end
            return Versions
        end,
        LoaderVersions = function (Data)
            local Versions = {}
            local Loader = Data.Loader
            local GameVersion = Data.GameVersion
            if Loader ~= "Vanilla" then
                table.insert(
                    Versions,
                    {
                        Name = "Latest",
                        Beta = false,
                        Id = "Latest"
                    }
                )
            end
            if Loader == "Vanilla" then
                table.insert(
                    Versions,
                    {
                        Name = "None",
                        Beta = false,
                        Id = "None"
                    }
                )
            elseif Loader == "Quilt" then
                local _, QuiltVersions = CoreLauncher.Http.JsonRequest(
                    "GET",
                    "https://meta.quiltmc.org/v3/versions/loader/" .. GameVersion
                )
                for _, Version in pairs(QuiltVersions) do
                    local Name = Version.loader.version
                    table.insert(
                        Versions,
                        {
                            Name = Name,
                            Beta = Name:find("-") ~= nil,
                            Id = Name
                        }
                    )
                end
            end
            return Versions
        end
    },
    Properties = {
        Memory = function ()
            return {
                Label = "Memory",
                Type = "number",
                Default = 4,
                Clamp = {
                    Min = 1,
                    Max = 32
                },
                Index = 3
            }
        end
    }
}

return Data
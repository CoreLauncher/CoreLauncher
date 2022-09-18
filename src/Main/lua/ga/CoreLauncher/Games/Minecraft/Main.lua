local Data = {}
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
                Default = Versions[1],
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
    GetInstanceComment = function (InstanceProperties)
        
    end,
    GetDefaultInstances = function ()
        return {
            {
                Id = "LatestRelease",
                Removable = false,
                Properties = {}
            }
        }
    end
}
Data.Functions.GetInstanceProperties()
return Data
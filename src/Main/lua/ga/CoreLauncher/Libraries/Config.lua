local Config = Object:extend()

local FS = require("fs")
local Json = require("json")

function Config:initialize(Path)
    self.Path = Path
    if FS.existsSync(Path) == false then
        FS.writeFileSync(Path, Json.encode({}))
    end
    self.Data = Json.decode(FS.readFileSync(Path))
end

function Config:GetKey(Key)
    local KeyPartitions = Key:split(".")
    local Data = self.Data
    for _, Partition in pairs(KeyPartitions) do
        Data = Data[Partition]
    end
    return Data
end

function Config:SetKey(Key, Value)
    local KeyPartitions = Key:split(".")
    p(KeyPartitions)
    local Data = self.Data
    for Index, Partition in pairs(KeyPartitions) do
        if Index == #KeyPartitions then
            Data[Partition] = Value
        else
            if Data[Partition] == nil then
                Data[Partition] = {}
            end
            Data = Data[Partition]
        end
    end
    self:Save()
    return true
end

function Config:SetKeyIfNotExists(Key, Value)
    if self:GetKey(Key) == nil then
        self:SetKey(Key, Value)
        return true
    end
    return false
end

function Config:Save()
    FS.writeFileSync(
        self.Path,
        Json.encode(
            self.Data,
            {
                indent = true,
                level = 0
            }
        )
    )
    return true
end

return Config
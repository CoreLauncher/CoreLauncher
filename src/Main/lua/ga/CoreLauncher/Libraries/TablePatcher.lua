local function TitleCase(Name)
    return Name:gsub("^%l", string.upper)
end

local function IndexPatcher(Name)
    if type(Name) ~= "string" then
        return Name
    end
    local Segments = string.split(Name, "_")
    local ReturnSegments = {}

    for Index, Segment in pairs(Segments) do
        ReturnSegments[Index] = TitleCase(Segment)
    end

    return table.concat(ReturnSegments, "")
end

local function Patcher(Tbl)
    local ReturnTable = {}

    for Index, Value in pairs(Tbl) do
        if type(Value) == "table" then
            ReturnTable[IndexPatcher(Index)] = Patcher(Value)
        else
            ReturnTable[IndexPatcher(Index)] = Value
        end
    end

    return ReturnTable
end

return Patcher
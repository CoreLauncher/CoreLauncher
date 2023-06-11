local function CloneObject(Object, CloneFunctions)
    if CloneFunctions == nil then
        CloneFunctions = false
    end
    Object = ToLua(Object)

    if type(Object) ~= "table" then
        return Object
    end

    local NewObject = {}
    for Key, Value in pairs(Object) do
        if type(Value) == "function" then
            if CloneFunctions then
                NewObject[Key] = Value
            end
        else
            NewObject[Key] = CloneObject(Value)
        end
    end

    return NewObject
end

return CloneObject
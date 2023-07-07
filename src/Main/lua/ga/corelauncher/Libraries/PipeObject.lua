local function RandomString(Length)
    local Characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    local String = ""
    for i = 1, Length do
        local RandomIndex = math.random(1, #Characters)
        String = String .. string.sub(Characters, RandomIndex, RandomIndex)
    end
    return String
end

local function GetObjectFunctions(Object)
    local Functions = {}

    for Key, Value in pairs(TypeWriter.JavaScript.Global.Object:getOwnPropertyNames(TypeWriter.JavaScript.Global.Object:getPrototypeOf(Object))) do
        if Value ~= "constructor" and Value ~= "length" then
            Functions[Value] = Object[Value]
        end
    end

    return Functions
end

local PipeCache = {}
local function PipeObject(Name, Object)
    local PipedObject = {}

    for Key, Value in pairs(GetObjectFunctions(Object)) do
        if PipeCache[Value] then
            PipedObject[Key] = PipeCache[Value]
        else
            local PipeHandle = "PipeFunction." .. Name .. "." .. Key .. "." .. RandomString(16)
            print(Key, Value, PipeHandle)
    
            CoreLauncher.IPCMain.handle(
                PipeHandle,
                function(...)
                    local Arguments = { ... }
                    table.remove(Arguments, 1)
                    return Value(table.unpack(Arguments))
                end
            )
    
            PipedObject[Key] = { PipeType = "function", PipeHandle = PipeHandle }
            PipeCache[Value] = PipedObject[Key]
        end
    end

    return PipedObject
end

return PipeObject
local Md5Anything = TypeWriter:JsRequire("hash-anything").md5

local function RandomString(Length)
    local Characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    local String = ""
    for i = 1, Length do
        local RandomIndex = math.random(1, #Characters)
        String = String .. string.sub(Characters, RandomIndex, RandomIndex)
    end
    return String
end

local ShiftArray = function (Array)
    local NewArray = {}
    for Index, Value in pairs(Array) do
        if Index ~= 1 then
            NewArray[Index - 1] = Value
        end
    end
    return NewArray
end

local function CreateFunctionPipe(Key, Value, Parent)
    local PipeHandle = "PipeFunction." .. RandomString(64)
    CoreLauncher.IPCMain:handle(
        PipeHandle,
        function (...)
            local Args = {...}
            if type(Args[2]) == "userdata" then
                Args = ShiftArray(Args)
                table.remove(Args, 1)
                return Object(Value(Parent, table.unpack(Args)))
            end
            return Object(Value(Parent, table.unpack(Args, 2)))
        end
    )
    return Object({PipeType = "function", PipeHandle = PipeHandle})
end

local function IgnoreProperty(Key)
    local Properties = {
        ["constructor"] = true,
        ["__defineGetter__"] = true,
        ["__defineSetter__"] = true,
        ["hasOwnProperty"] = true,
        ["__lookupGetter__"] = true,
        ["__lookupSetter__"] = true,
        ["isPrototypeOf"] = true,
        ["propertyIsEnumerable"] = true,
        ["toString"] = true,
        ["valueOf"] = true,
        ["toLocaleString"] = true,
    }
    return Properties[Key] ~= nil
end

local PipeCache = {}
local function PipeObject(Obj, IsSub)
    local ObjectHash = Md5Anything(Obj)
    if PipeCache[ObjectHash] and not IsSub then
        return PipeCache[ObjectHash]
    end

    local PipedObject = {}

    if js.typeof(Obj) == "object" then
        local Keys = js.global.Object:getOwnPropertyNames(js.global.Object:getPrototypeOf(Obj))
        for _, FuncName in pairs(Keys) do
            if js.typeof(Obj[FuncName]) == "function" and IgnoreProperty(FuncName) == false then
                PipedObject[FuncName] = CreateFunctionPipe(FuncName, Obj[FuncName], Obj)
            end
        end
    end

    for Key, Value in pairs(Obj) do
        if type(Value) == "function" or js.typeof(Value) == "function" then
            PipedObject[Key] = CreateFunctionPipe(Key, Value, Obj)
        elseif type(Value) == "table" or js.typeof(Value) == "object" then
            PipedObject[Key] = PipeObject(Value, true)
        else
            PipedObject[Key] = Value
        end
    end

    if not IsSub then
        PipeCache[ObjectHash] = Object(PipedObject)
    end
    return Object(PipedObject)
end

return PipeObject
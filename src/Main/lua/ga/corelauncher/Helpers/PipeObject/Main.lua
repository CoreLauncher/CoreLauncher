local Inspect = Import("ga.corelauncher.Helpers.inspect")

return function (Obj)
    local ToPipeData = {}

    for Index, Value in pairs(Obj) do
        if type(Value) == "function" then
            ToPipeData[Index] = function (...)
                local Args = {...}
                local ArgsCount = select("#", ...)
                local ArgsTable = {}

                for Index = 1, ArgsCount do
                    ArgsTable[Index] = Args[Index]
                end

                return Value(unpack(ArgsTable))
            end
        elseif type(Value) == "table" then
            ToPipeData[Index] = PipeObject(Value)
        else
            ToPipeData[Index] = Value
        end
    end

    print(Inspect(ToPipeData))

    return Object(ToPipeData)
end
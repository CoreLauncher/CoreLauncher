const RandomString = require("randomstring").generate

function GetObjectFunctions(Obj) {
    const Functions = {}

    const Prototype = Object.getPrototypeOf(Obj)
    const PropertyNames = Object.getOwnPropertyNames(Prototype)
    for (const FunctionName of PropertyNames) {
        Functions[FunctionName] = Obj[FunctionName]
    }

    return Functions
}

function CloneWithoutFunctions(Object) {
    if (typeof Object != "object") { return Object }

    if (Object instanceof Array) {
        const NewArray = []
        for (const Value of Object) {
            if (typeof Value == "function") { continue }
            NewArray.push(CloneWithoutFunctions(Value))
        }
        return NewArray
    } else {
        const NewObject = {}
        for (const Key in Object) {
            const Value = Object[Key]
            if (typeof Value == "function") { continue }
            NewObject[Key] = CloneWithoutFunctions(Value)
        }
        return NewObject
    }
}

var PipeCache = {}
function PipeObject(Name, Object) {
    var PipedObject = {}

    var Functions = GetObjectFunctions(Object)
    for (const Key in Functions) {
        const Value = Functions[Key]
        if (PipeCache[Value]) {
            PipedObject[Key] = PipeCache[Value]
        } else {
            const PipeHandle = `PipeFunction.${Name}.${Key}.${RandomString(16)}`

            CoreLauncher.IPCMain.handle(
                PipeHandle,
                async function () {
                    const Arguments = Array.prototype.slice.call(arguments)
                    Arguments.shift()
                    return CloneWithoutFunctions(await Value.apply(Object, Arguments))
                }
            )

            PipedObject[Key] = { PipeType: "function", PipeHandle: PipeHandle }
            PipeCache[Value] = PipedObject[Key]
        }
    }

    return PipedObject
}

module.exports = PipeObject

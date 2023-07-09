function ClassCreator (Name, Constructor, Methods) {
    const Class = class {
        constructor (...Arguments) {
            Constructor(this, ...Arguments)
        }
    }

    for (const MethodName in Methods) {
        const Method = Methods[MethodName]
        Class.prototype[MethodName] = function(...Arguments) {
            return Method(this, ...Arguments)
        }
    }

    return Class
}

module.exports = ClassCreator
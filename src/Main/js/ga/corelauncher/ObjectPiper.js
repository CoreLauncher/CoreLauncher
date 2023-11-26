class ObjectPiper {
    constructor(IPC, MainObject, MainObjectName) {
        this.MainObject = MainObject
        this.MainObjectName = MainObjectName
        this.IPC = IPC

        this.ClearCache()

        IPC.handle(
            "ObjectPiper.GetMainObject",
            function () {
                return MainObject
            }
        )
    }

    ClearCache() {
        this.PipedObjects = {}

    }

    PipeObject(ObjectName) {
        
    }
}

return ObjectPiper
const FS = require("fs")

class DataBase {

    constructor(Path) {
        this.Path = Path
        if (!FS.existsSync(Path)) {
            FS.writeFileSync(Path, "{}")
        }
        this.Data = FS.readJSONSync(Path)
    }

    GetKey(Key, Default) {
        const KeyParts = Key.split(".")
        let Data = this.Data
        for (const KeyPart of KeyParts) {
            if (Data[KeyPart] === undefined) {
                return Default
            }
            Data = Data[KeyPart]
        }
        return Data
    }

    SetKey(Key, Value) {
        const KeyParts = Key.split(".")
        let Data = this.Data
        for (const KeyPart of KeyParts) {
            if (Data[KeyPart] === undefined) {
                Data[KeyPart] = {}
            }
            Data = Data[KeyPart]
        }
        Data = Value
        FS.writeJSONSync(this.Path, this.Data)
    }

    SetKeyIfNotExists(Key, Value) {
        if (this.GetKey(Key, null) === null) {
            this.SetKey(Key, Value)
        }
    }
}
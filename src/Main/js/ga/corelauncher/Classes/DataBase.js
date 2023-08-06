const FS = require("fs-extra")

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
        var Data = this.Data
        var Index = 0
        for (const KeyPart of KeyParts) {
            if (Index === KeyParts.length - 1) {
                Data[KeyPart] = Value
                break
            }
            if (Data[KeyPart] === undefined) {
                Data[KeyPart] = {}
            }
            Data = Data[KeyPart]
            Index++
        }
        FS.writeJSONSync(this.Path, this.Data, {spaces: 4})
    }

    SetKeyIfNotExists(Key, Value) {
        if (this.GetKey(Key, null) === null) {
            this.SetKey(Key, Value)
        }
    }

    RemoveKey(Key) {
        this.SetKey(Key, undefined)
    }
}

module.exports = DataBase
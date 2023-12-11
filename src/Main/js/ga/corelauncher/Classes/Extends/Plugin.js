const ResourceBase64 = await Import("ga.corelauncher.Helpers.ResourceBase64")

class CoreLauncherPlugin {
    constructor() {

    }

    SuperConstructor() {
        
    }

    GetIconBase64() {
        return ResourceBase64(this.Icon)
    }
}

return CoreLauncherPlugin
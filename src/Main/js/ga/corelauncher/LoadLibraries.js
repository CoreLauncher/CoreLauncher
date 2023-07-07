TypeWriter.LoadFile(TypeWriter.ResourceManager.GetFilePath("CoreLauncher", "/Libraries/ElectronHelper.twr"))
TypeWriter.LoadFile(TypeWriter.ResourceManager.GetFilePath("CoreLauncher", "/Libraries/Static.twr"))

const PluginManagerClass = Import("ga.corelauncher.Classes.PluginManager")
const PluginManager = new PluginManagerClass()
PluginManager.LoadPlugins(TypeWriter.ApplicationData + "/CoreLauncher/Plugins/")

Import("electronhelper")(
    "CoreLauncher",
    {
        Name: "CoreLauncher",
        Icon: {
            win32: "CoreLauncher:/ico.ico"
        },
        Load: "ga.corelauncher"
    }
)    
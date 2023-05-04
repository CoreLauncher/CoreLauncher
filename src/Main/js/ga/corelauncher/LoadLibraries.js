TypeWriter.LoadFile(TypeWriter.ResourceManager.GetFilePath("CoreLauncher", "/Libraries/ElectronHelper.twr"))
TypeWriter.LoadFile(TypeWriter.ResourceManager.GetFilePath("CoreLauncher", "/Libraries/Static.twr"))
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
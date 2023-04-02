module.exports = function LoadLibraries() {
    TypeWriter.LoadFile(TypeWriter.ResourceManager.GetFilePath("CoreLauncher", "/Libraries/ElectronHelper.twr"))
    Import("electronhelper")
    TypeWriter.LoadFile(TypeWriter.ResourceManager.GetFilePath("CoreLauncher", "/Libraries/Static.twr"))
}
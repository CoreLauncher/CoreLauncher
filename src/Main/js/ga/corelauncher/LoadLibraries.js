module.exports = function LoadLibraries() {
    TypeWriter.LoadFile(TypeWriter.ResourceManager.GetFilePath("CoreLauncher", "/Libraries/ElectronHelper.twr"))
    TypeWriter.LoadFile(TypeWriter.ResourceManager.GetFilePath("CoreLauncher", "/Libraries/Static.twr"))
    Import("electronhelper")
}
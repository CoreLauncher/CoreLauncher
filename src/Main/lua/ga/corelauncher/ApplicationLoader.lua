Import("ga.corelauncher.LoadLibraries")()





_G.CoreLauncher = {}
CoreLauncher.Electron = Import("electronhelper")
CoreLauncher.ElectronApplication = CoreLauncher.Electron.app

print(CoreLauncher.ElectronApplication:whenReady())
Await(CoreLauncher.ElectronApplication:whenReady())

Import("ga.corelauncher")
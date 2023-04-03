Import("ga.corelauncher.LoadLibraries")()





_G.CoreLauncher = {}
CoreLauncher.Electron = Import("electronhelper")
CoreLauncher.ElectronApplication = CoreLauncher.Electron.app

Await(CoreLauncher.ElectronApplication:whenReady())

Import("ga.corelauncher")
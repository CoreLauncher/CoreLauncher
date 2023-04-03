Import("ga.corelauncher.LoadLibraries")()

local function Await(P)
    
end

_G.CoreLauncher = {}
CoreLauncher.Electron = Import("electronhelper")
CoreLauncher.ElectronApplication = CoreLauncher.Electron.app

CoreLauncher.ElectronApplication:whenReady()

Import("ga.corelauncher")
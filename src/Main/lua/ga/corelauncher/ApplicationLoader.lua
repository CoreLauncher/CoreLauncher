Import("ga.corelauncher.LoadLibraries")()

local function Await(P)
    local Co = coroutine.running()
    P:then(
        function (...)
            coroutine.resume(Co, ...)
        end
    )
    return coroutine.yield()
end



_G.CoreLauncher = {}
CoreLauncher.Electron = Import("electronhelper")
CoreLauncher.ElectronApplication = CoreLauncher.Electron.app

print(CoreLauncher.ElectronApplication:whenReady())
Await(CoreLauncher.ElectronApplication:whenReady())

Import("ga.corelauncher")
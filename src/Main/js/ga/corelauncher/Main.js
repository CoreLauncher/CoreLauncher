const FS = require("fs-extra")

globalThis.CoreLauncher = {}
CoreLauncher.DevMode = process.env.CORELAUNCHER_DEV == "true"
CoreLauncher.ApplicationData = `${TypeWriter.ApplicationData}/CoreLauncher`
CoreLauncher.PluginsFolder = `${CoreLauncher.ApplicationData}/Plugins`
CoreLauncher.PluginDataFolder = `${CoreLauncher.ApplicationData}/PluginData`

FS.ensureDirSync(CoreLauncher.ApplicationData)
FS.ensureDirSync(CoreLauncher.PluginsFolder)
FS.ensureDirSync(CoreLauncher.PluginDataFolder)

CoreLauncher.DataBase = new (await Import("ga.corelauncher.Classes.DataBase"))(`${CoreLauncher.ApplicationData}/Database.json`)
CoreLauncher.PluginManager = new (await Import("ga.corelauncher.Classes.PluginManager"))(CoreLauncher.PluginsFolder)
CoreLauncher.AccountManager = new (await Import("ga.corelauncher.Classes.AccountManager"))(CoreLauncher.PluginManager.ListAccountTypes())
CoreLauncher.GameManager = new (await Import("ga.corelauncher.Classes.GameManager"))(CoreLauncher.PluginManager.ListGames())
CoreLauncher.TaskManager = new (await Import("ga.corelauncher.Classes.TaskManager"))()
CoreLauncher.WindowControl = new (await Import("ga.corelauncher.Classes.WindowControl"))

CoreLauncher.Electron = await(await Import("electronhelper"))(
    {
        Id: "CoreLauncher",
        Name: "CoreLauncher",
        Icon: {
            Windows: "CoreLauncher:/ico.ico",
            MacOs: "CoreLauncher:/ico.icns",
        }
    }
)
CoreLauncher.ElectronApplication = CoreLauncher.Electron.app
await CoreLauncher.ElectronApplication.whenReady()
await CoreLauncher.PluginManager.LoadPlugins()

CoreLauncher.IPCMain = CoreLauncher.Electron.ipcMain
CoreLauncher.BrowserWindow = new CoreLauncher.Electron.BrowserWindow(
    {
        show: false,
        frame: false,
        center: true,
        titleBarStyle: "hidden",

        width: 275,
        height: 400,
        minWidth: 1000,
        minHeight: 600,

        webPreferences: {
            preload: TypeWriter.ResourceManager.GetFilePath("CoreLauncher", "/Frontend/preload.js")
        }
    }
)
CoreLauncher.BrowserWindow.setResizable(false)

await Import("ga.corelauncher.IPC.Pipes.AccountManager")
await Import("ga.corelauncher.IPC.Pipes.DataBase")
await Import("ga.corelauncher.IPC.Pipes.GameManager")
await Import("ga.corelauncher.IPC.Pipes.PluginManager")
await Import("ga.corelauncher.IPC.Pipes.TaskManager")
await Import("ga.corelauncher.IPC.Pipes.WindowControl")

CoreLauncher.StaticServer = await Import("me.corebyte.static")(
    9875,
    "CoreLauncher",
    "Frontend",
    null,
    function (_, Request, Response) {
        if (Request.path != "/AccountCallback.txt") { return }
        if (Request.query == undefined) { return }
        const Data = Json.parse(
            Base64.decode(Request.query.d)
        )
        CoreLauncher.AccountManager.FinishedConnection(Data.Type, Data.Data)
        CoreLauncher.BrowserWindow.restore()
    }
)

if (CoreLauncher.DevMode) {
    TypeWriter.Logger.Warning("We are running in dev env");
    CoreLauncher.BrowserWindow.loadURL("http://localhost:9874");
    CoreLauncher.BrowserWindow.openDevTools();
} else {
    CoreLauncher.BrowserWindow.loadURL("http://localhost:9875");
}

CoreLauncher.BrowserWindow.once(
    "ready-to-show",
    function () {
        CoreLauncher.BrowserWindow.show();

        CoreLauncher.BrowserWindow.setResizable(true);
        CoreLauncher.BrowserWindow.setSize(1000, 600);
        CoreLauncher.BrowserWindow.center();
    }
);

CoreLauncher.BrowserWindow.on(
    "resize",
    function () {
        const Size = CoreLauncher.BrowserWindow.getSize();
        CoreLauncher.DataBase.SetKey("Window.Width", Size[0]);
        CoreLauncher.DataBase.SetKey("Window.Height", Size[1]);
    }
);



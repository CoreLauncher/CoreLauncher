using System;
using System.Runtime.InteropServices;
using System.Threading;

public static class TrayExport
{
    private static Tray? tray;
    private static Thread? uiThread;

    [UnmanagedCallersOnly(EntryPoint = "tray_create")]
    public static void CreateTray()
    {
        uiThread = new Thread(() =>
        {
            tray = new Tray("C:\\Users\\jeans\\Coding-Projects\\CoreLauncher\\icon.ico", "CoreLauncher");
            tray.Click += (_, _) => Console.WriteLine("Tray Clicked");
        });
        
        uiThread.SetApartmentState(ApartmentState.STA);
        uiThread.Start();
    }

    [UnmanagedCallersOnly(EntryPoint = "tray_destroy")]
    public static void DestroyTray()
    {
        if (tray != null)
        {
            tray?.Dispose();
            tray = null;
        }
    }
}
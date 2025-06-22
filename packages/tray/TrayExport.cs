using System;
using System.Runtime.InteropServices;

namespace CoreLauncher;

public static class TrayExport
{
    private static Tray? tray;

    [UnmanagedCallersOnly(EntryPoint = "tray_create")]
    public static void CreateTray()
    {
        tray = new Tray("icon.icon", "My Application");
        tray.Click += (_, _) => Console.WriteLine("Tray Clicked");
    }

    [UnmanagedCallersOnly(EntryPoint = "tray_destroy")]
    public static void DestroyTray()
    {
        tray?.Dispose();
        tray = null;
    }
}
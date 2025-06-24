using System;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

namespace tray;

public static class TrayExport
{
    private static Tray tray;
    private static Thread uiThread;
    private static ClickCallBack clickCallback;
    private static ManualResetEvent trayReady = new ManualResetEvent(false);
    private static readonly object locker = new();

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void ClickCallBack();
    
    [UnmanagedCallersOnly(EntryPoint = "tray_create")]
    public static void CreateTray(IntPtr iconPathPtr, IntPtr namePtr, IntPtr callbackPtr)
    {
        lock (locker)
        {
            if (tray != null)
            {
                Console.WriteLine("[Tray] Warning: Tray already exists. Returning...");
                return;
            }
            string iconPath = Marshal.PtrToStringUTF8(iconPathPtr);
            string iconName = Marshal.PtrToStringUTF8(namePtr);
            clickCallback = Marshal.GetDelegateForFunctionPointer<ClickCallBack>(callbackPtr);

            trayReady.Reset();

            uiThread = new Thread(() =>
            {
                try
                {
                    tray = new Tray(iconPath, iconName);
                    tray.Click += (_, _) => clickCallback?.Invoke();

                    trayReady.Set();
                    Console.WriteLine($"[Tray] Created with icon: {iconPath}, name: {iconName}");
                    Application.Run();
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine($"[Tray] Error in UI thread: {ex}");
                }
            });

            uiThread.SetApartmentState(ApartmentState.STA);
            uiThread.Start();

            trayReady.WaitOne();
        }
    }

    [UnmanagedCallersOnly(EntryPoint = "tray_destroy")]
    public static void DestroyTray()
    {
        lock (locker)
        {
            try
            {
                tray?.Dispose();
            }
            finally
            {
                tray = null;
            }
        
            if (uiThread != null && uiThread.IsAlive)
            {
                try
                {
                    Application.ExitThread();
                    uiThread.Join();
                }
                finally
                {
                    uiThread = null;
                }
            }
        }
    }
}
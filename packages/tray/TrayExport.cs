using System;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

public static class TrayExport
{
    private static Tray? tray;
    private static Thread? uiThread;
    private static ClickCallBack? clickCallback;

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void ClickCallBack();
    
    private static ManualResetEvent trayReady = new ManualResetEvent(false);
    
    [UnmanagedCallersOnly(EntryPoint = "tray_create")]
    public static void CreateTray(IntPtr iconPathPtr, IntPtr namePtr, IntPtr callbackPtr)
    {
        string iconPath = Marshal.PtrToStringUTF8(iconPathPtr);
        string name = Marshal.PtrToStringUTF8(namePtr);
        clickCallback = Marshal.GetDelegateForFunctionPointer<ClickCallBack>(callbackPtr);
        
        trayReady.Reset();
        
        uiThread = new Thread(() =>
        {
            tray = new Tray(iconPath, name);
            tray.Click += (_, _) => clickCallback?.Invoke();

            trayReady.Set();
            // Allows notifyicon to do its job and keeps the thread breathing :D
            Application.Run();
        });
        
        uiThread.SetApartmentState(ApartmentState.STA);
        uiThread.Start();
        
        trayReady.WaitOne();
    }

    [UnmanagedCallersOnly(EntryPoint = "tray_destroy")]
    public static void DestroyTray()
    {
        if (tray != null)
        {
            tray?.Dispose();
            tray = null;
        }
        
        if (uiThread != null && uiThread.IsAlive)
        {
            Application.ExitThread(); // Terminates application.run
            uiThread.Join(); // Waits for thread ending
            uiThread = null;
        }
    }
}
using System;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

namespace tray;

public static class TrayExport
{
    private static Tray tray;
    private static Thread uiThread;
    private static ManualResetEvent trayReady = new ManualResetEvent(false);
    private static readonly object locker = new();

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void ClickCallBack();
    
    private static ClickCallBack leftClick;
    private static ClickCallBack rightClick;
    private static ClickCallBack middleClick;
    private static ClickCallBack doubleClick;
    
    [UnmanagedCallersOnly(EntryPoint = "tray_create")]
    public static void CreateTray(IntPtr namePtr, IntPtr iconPathPtr, IntPtr leftClickPtr, IntPtr rightClickPtr, IntPtr middleClickPtr, IntPtr doubleClickPtr)
    {
        lock (locker)
        {
            if (tray != null)
            {
                Console.WriteLine("[Tray] Warning: Tray already exists. Returning...");
                return;
            }
            
            string iconName = Marshal.PtrToStringUTF8(namePtr);
            string iconPath = Marshal.PtrToStringUTF8(iconPathPtr);
            leftClick = Marshal.GetDelegateForFunctionPointer<ClickCallBack>(leftClickPtr);
            rightClick = Marshal.GetDelegateForFunctionPointer<ClickCallBack>(rightClickPtr);
            middleClick = Marshal.GetDelegateForFunctionPointer<ClickCallBack>(middleClickPtr);
            doubleClick = Marshal.GetDelegateForFunctionPointer<ClickCallBack>(doubleClickPtr);

            trayReady.Reset();

            uiThread = new Thread(() =>
            {
                try
                {
                    tray = new Tray(iconPath, iconName);
                    tray.LeftClick += (_, _) => leftClick.Invoke();
                    tray.RightClick += (_, _) => rightClick.Invoke();
                    tray.MiddleClick += (_, _) => middleClick.Invoke();
                    tray.DoubleClick += (_, _) => doubleClick.Invoke();

                    trayReady.Set();
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
            try { tray?.Dispose(); }
            finally { tray = null; }
        }

        if (uiThread != null && uiThread.IsAlive)
        {
            try
            {
                Application.ExitThread();
                uiThread.Join();
            }
            finally { uiThread = null; }
        }
    }
}
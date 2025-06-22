using System;
#if WINDOWS
using System.Windows.Forms;
#endif
namespace CoreLauncher;

public class Tray : IDisposable
{
#if WINDOWS
    private NotifyIcon notifyIcon;
#endif
    
    public event EventHandler? Click;

    public Tray(string iconPath, string tooltip = "")
    {
#if WINDOWS
        notifyIcon = new NotifyIcon();
        notifyIcon.Icon = new System.Drawing.Icon(iconPath);
        notifyIcon.Text = tooltip;
        notifyIcon.Visible = true;
        notifyIcon.Click += (sender, args) => Click?.Invoke(this, EventArgs.Empty);
#endif
        
        // TODO: add macOS and Linux implementations
    }
    
    public void Dispose()
    {
        Destroy();
    }

    public void Destroy()
    { 
#if WINDOWS
NotifyIcon.Visible = false;
NotifyIcon.Dispose();
#endif
        // TODO: macOS and Linux cleanup
    }
}
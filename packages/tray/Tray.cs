using System;
#if WINDOWS
using System.Windows.Forms;
#endif

namespace tray;

public class Tray : IDisposable
{
#if WINDOWS
    private NotifyIcon notifyIcon;
#endif
    
    public event EventHandler Click;
    public event EventHandler LeftClick;
    public event EventHandler RightClick;

    public Tray(string iconPath, string iconName = "")
    {
#if WINDOWS
        notifyIcon = new NotifyIcon();
        notifyIcon.Icon = new System.Drawing.Icon(iconPath);
        notifyIcon.Text = iconName;
        notifyIcon.Visible = true;
        notifyIcon.Click += (sender, args) => Click?.Invoke(this, EventArgs.Empty);
        /*notifyIcon.MouseClick += (sender, args) =>
        {
            if (args.Button == MouseButtons.Left) 
                LeftClick?.Invoke(this, EventArgs.Empty);
            else if (args.Button == MouseButtons.Right) 
                RightClick?.Invoke(this, EventArgs.Empty);
        };*/
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
        notifyIcon.Visible = false;
        notifyIcon.Dispose();
        notifyIcon = null!;
#endif
        // TODO: macOS and Linux cleanup
    }
}
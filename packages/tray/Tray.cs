using System;
#if WINDOWS
using System.Windows.Forms;
using Accessibility;
#endif

namespace tray;

public class Tray : IDisposable
{
#if WINDOWS
    private NotifyIcon notifyIcon;
#endif
    
    public event EventHandler LeftClick;
    public event EventHandler RightClick;
    public event EventHandler MiddleClick;
    public event EventHandler DoubleClick;

    public Tray(string iconPath, string iconName = "")
    {
#if WINDOWS
        notifyIcon = new NotifyIcon
        {
            Site = null,
            BalloonTipText = null!,
            BalloonTipIcon = ToolTipIcon.None,
            BalloonTipTitle = null!,
            ContextMenuStrip = null,
            Icon = new System.Drawing.Icon(iconPath),
            Text = iconName,
            Visible = true,
            Tag = null
        };
        
        notifyIcon.DoubleClick += (_, _) => DoubleClick?.Invoke(this, EventArgs.Empty);
        notifyIcon.MouseClick += (_, args) =>
        {
            switch (args.Button)
            {
                case MouseButtons.Left:
                    LeftClick?.Invoke(this, EventArgs.Empty);
                    break;
                case MouseButtons.Right:
                    RightClick?.Invoke(this, EventArgs.Empty);
                    break;
                case MouseButtons.Middle:
                    MiddleClick?.Invoke(this, EventArgs.Empty);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        };
#endif

        // TODO: add macOS and Linux implementations
    }
    
    public void Dispose() => Destroy(); 

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
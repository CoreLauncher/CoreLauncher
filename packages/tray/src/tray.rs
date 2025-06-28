use crate::callbacks::ClickCallbacks;
use std::sync::Arc;
use tray_icon::{Icon, MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};

pub struct TrayHandle {
    tray_icon: tray_icon::TrayIcon,
}

impl TrayHandle {
    pub fn new(name: String, icon_path: String, callbacks: ClickCallbacks) -> Self {
        let icon = Icon::from_path(&icon_path, None).expect("Failed to load icon");

        let tray_icon = TrayIconBuilder::new()
            .with_tooltip(&name)
            .with_icon(icon)
            .build()
            .expect("Failed to build tray icon");

        let callbacks = Arc::new(callbacks);

        let event_handler = {
            let callbacks = Arc::clone(&callbacks);
            move |event: TrayIconEvent| {

                match event {
                    TrayIconEvent::Click {
                        button,
                        button_state,
                        ..
                    } => {
                        if button_state == MouseButtonState::Up {
                            match button {
                                MouseButton::Left => (callbacks.left)(),
                                MouseButton::Right => (callbacks.right)(),
                                MouseButton::Middle => (callbacks.middle)(),
                            }
                        }
                    }
                    TrayIconEvent::DoubleClick { button, .. } => {
                        if button == MouseButton::Left {
                            (callbacks.double)();
                        }
                    }
                    _ => {}
                }
            }
        };

        TrayIconEvent::set_event_handler(Some(event_handler));

        TrayHandle { tray_icon }
    }

    pub fn destroy(&mut self) {
        TrayIconEvent::set_event_handler::<fn(TrayIconEvent)>(None);

        // drop tray_icon explicitly if needed
        let _ = &self.tray_icon;
    }
}

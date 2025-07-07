use std::ffi::CStr;
use std::ffi::CString;
use std::os::raw::c_char;
use std::path::Path;
use tray_icon::MouseButtonState;
use tray_icon::{Icon, TrayIcon, TrayIconEvent, TrayIconEventReceiver};
use tray_icon::{TrayIconBuilder, menu::Menu};

fn tray_from_ptr(ptr: *const u8) -> &'static mut TrayIcon {
    unsafe { &mut *(ptr as *mut TrayIcon) }
}

fn receiver_from_ptr(ptr: *const u8) -> &'static TrayIconEventReceiver {
    unsafe { &*(ptr as *const TrayIconEventReceiver) }
}

fn str_from_ptr(ptr: *const u8) -> String {
    if ptr.is_null() {
        return String::new();
    }
    unsafe { CStr::from_ptr(ptr as *const c_char) }
        .to_str()
        .unwrap_or_default()
        .to_string()
}

fn cstring_from_string(string: String) -> CString {
    CString::new(string).unwrap_or_else(|_| CString::new("").unwrap())
}

#[unsafe(no_mangle)]
pub extern "C" fn tray_construct_receiver() -> *const u8 {
    let receiver = TrayIconEvent::receiver().clone();
    let boxed_receiver = Box::new(receiver);
    let ptr = Box::into_raw(boxed_receiver) as *const u8;
    return ptr;
}

#[unsafe(no_mangle)]
pub extern "C" fn tray_pump_events(
    receiver_ptr: *const u8,
    callback: extern "C" fn(id: *const c_char, event: *const c_char),
) {
    let receiver = receiver_from_ptr(receiver_ptr);
    let event = receiver.try_recv();
    if let Ok(event) = event {
        let event_string = match event {
            TrayIconEvent::Click {
                button_state: MouseButtonState::Down,
                ..
            } => "Click".to_string(),

            _ => "Unknown event".to_string(),
        };
        callback(
            cstring_from_string(event.id().0.clone()).as_ptr(),
            cstring_from_string(event_string).as_ptr(),
        );
    }
}

#[unsafe(no_mangle)]
pub extern "C" fn tray_construct(id: *const u8) -> *const u8 {
    let menu = Menu::new();
    let tray = TrayIconBuilder::new()
        .with_id(str_from_ptr(id))
        .with_title("Tray Icon")
        .with_menu(Box::new(menu))
        .build()
        .unwrap();

    // Box the tray to keep it alive and leak it to get a stable pointer
    let boxed_tray = Box::new(tray);
    let ptr = Box::into_raw(boxed_tray) as *const u8;
    return ptr;
}

#[unsafe(no_mangle)]
pub extern "C" fn tray_set_icon(tray_ptr: *const u8, path: *const u8) {
    let tray = tray_from_ptr(tray_ptr);

    let path_str = str_from_ptr(path);
    tray.set_icon(Some(Icon::from_path(Path::new(&path_str), None).unwrap()))
        .unwrap();
}

#[unsafe(no_mangle)]
pub extern "C" fn tray_set_label(tray_ptr: *const u8, label: *const u8) {
    let tray = tray_from_ptr(tray_ptr);

    let label_str = str_from_ptr(label);
    tray.set_title(Some(&label_str));
    tray.set_tooltip(Some(&label_str)).unwrap();
}

#[unsafe(no_mangle)]
pub extern "C" fn tray_set_visibility(tray_ptr: *const u8, visible: bool) {
    let tray = tray_from_ptr(tray_ptr);
    tray.set_visible(visible).unwrap();
}

#[unsafe(no_mangle)]
pub extern "C" fn tray_destroy(tray_ptr: *const u8) {
    let tray = tray_from_ptr(tray_ptr);
    unsafe {
        drop(Box::from_raw(tray as *mut TrayIcon));
    }
}

use std::{ffi::CStr, os::raw::c_char};
use std::cell::RefCell;
use std::thread;
use std::time::Duration;
use windows::Win32::UI::WindowsAndMessaging::{
    GetMessageW, TranslateMessage, DispatchMessageW, MSG,
};

mod tray;
mod callbacks;

use tray::TrayHandle;
use callbacks::ClickCallbacks;

thread_local! {
    static TRAY: RefCell<Option<TrayHandle>> = RefCell::new(None);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn tray_create(
    name: *const c_char,
    icon_path: *const c_char,
    left: extern "C" fn(),
    right: extern "C" fn(),
    middle: extern "C" fn(),
    double: extern "C" fn(),
) {
    eprintln!("[Rust] tray_create() called.");

    eprintln!("[Rust] Calling left callback manually to test FFI:");
    (left)();
    let name = unsafe { CStr::from_ptr(name).to_string_lossy().into_owned() };
    let icon_path = unsafe { CStr::from_ptr(icon_path).to_string_lossy().into_owned() };

    let callbacks = ClickCallbacks {
        left,
        right,
        middle,
        double,
    };

    TRAY.with(|tray| {
        let tray_handle = TrayHandle::new(name, icon_path, callbacks);
        *tray.borrow_mut() = Some(tray_handle);
    });

    start_message_loop();
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn tray_destroy() {
    TRAY.with(|tray| {
        if let Some(mut tray_handle) = tray.borrow_mut().take() {
            tray_handle.destroy();
        }
    });
}

pub fn start_message_loop() {
    thread::spawn(|| {
        eprintln!("[Rust] Message loop started.");
        unsafe {
            let mut msg = MSG::default();
            loop {
                if GetMessageW(&mut msg, None, 0, 0).into() {
                    eprintln!("[Rust] Dispatching a Windows message.");
                    let _ = TranslateMessage(&msg);
                    DispatchMessageW(&msg);
                }
                thread::sleep(Duration::from_millis(10));
            }
        }
    });
}
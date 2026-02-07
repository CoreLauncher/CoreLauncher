use interprocess::local_socket::{GenericNamespaced, Listener, ListenerOptions, prelude::*};
use std::io;
use std::io::Write;
use std::thread;
use std::time::Duration;

fn main() {
    match ensure_single_instance("CoreLauncher") {
        Ok(listener) => run_app_with_ipc(listener),
        Err(err) if err.kind() == io::ErrorKind::AlreadyExists => {
            send_args_to_running_instance();
            eprintln!("Another instance is already running! Closing...");
            return;
        }
        Err(err) => {
            eprintln!("Failed to start CoreLauncher: {}", err);
            return;
        }
    }
}

fn ensure_single_instance(app_id: &str) -> std::io::Result<Listener> {
    let name = app_id.to_ns_name::<GenericNamespaced>()?;
    let options = ListenerOptions::new().name(name);

    match options.create_sync() {
        Ok(listener) => Ok(listener),
        Err(error) if error.kind() == io::ErrorKind::AddrInUse => Err(io::Error::new(
            io::ErrorKind::AlreadyExists,
            "Another instance is already running",
        )),
        Err(err) => Err(err),
    }
}

fn send_args_to_running_instance() {
    let args: Vec<String> = std::env::args().collect();
    let name = "CoreLauncher"
        .to_ns_name::<GenericNamespaced>()
        .expect("invalid socket name");

    if let Ok(mut stream) = LocalSocketStream::connect(name) {
        let payload = args.join("\n");
        let _ = stream.write_all(payload.as_bytes());
    }
}

fn run_app_with_ipc(listener: Listener) {
    std::thread::spawn(move || {
        for conn in listener.incoming() {
            if let Ok(mut _stream) = conn {
                //TODO: read args, also remov the _ before stream
            }
        }
    });

    thread::sleep(Duration::from_secs(20)); // <-- also remove this shit and run the app here
}

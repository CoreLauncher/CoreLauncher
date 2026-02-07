use interprocess::local_socket::{GenericNamespaced, Listener, ListenerOptions, prelude::*};
use std::io;
use std::io::{Read, Write};

pub enum InstanceState {
    Primary(Listener),
    Secondary,
}

///
/// JUST COPY THIS MAIN FUNCTION IT WILL WORK AS LONG AS YOU ALSO COPY USE THING BELOW!!!
///

// use ipc_handler::{check_instance, forward_args, run_ipc_server, InstanceState};

fn main() {
    match check_instance("CoreLauncher") {
        Ok(InstanceState::Primary(listener)) => {
            run_ipc_server(listener, |args| {
                println!("Received args: {:?}", args);
                // TODO: Implement logic to handle incoming arguments
            });

            // start the app and all here! (just call the function)
            println!("CoreLauncher has started");
        }
        Ok(InstanceState::Secondary) => {
            let _ = forward_args("CoreLauncher");
            eprintln!("Another instance is already running! Closing...");
            return;
        }
        Err(err) => {
            eprintln!("Failed to start CoreLauncher: {}", err);
            return;
        }
    }
}

pub fn check_instance(app_id: &str) -> io::Result<InstanceState> {
    let name = app_id.to_ns_name::<GenericNamespaced>()?;
    let options = ListenerOptions::new().name(name);

    match options.create_sync() {
        Ok(listener) => Ok(InstanceState::Primary(listener)),
        Err(err) if err.kind() == io::ErrorKind::AddrInUse => Ok(InstanceState::Secondary),
        Err(err) => Err(err),
    }
}

fn forward_args(app_id: &str) -> io::Result<()> {
    let args: Vec<String> = std::env::args().collect();

    let name = app_id.to_ns_name::<GenericNamespaced>()?;
    let mut stream = LocalSocketStream::connect(name)?;

    stream.write_all(args.join("\n").as_bytes())?;
    Ok(())
}

pub fn run_ipc_server<F>(listener: Listener, mut handler: F)
where
    F: FnMut(Vec<String>) + Send + 'static,
{
    std::thread::spawn(move || {
        for conn in listener.incoming() {
            if let Ok(mut stream) = conn {
                let mut buf = String::new();
                if stream.read_to_string(&mut buf).is_ok() {
                    let args = buf.lines().map(String::from).collect();
                    handler(args);
                }
            }
        }
    });
}

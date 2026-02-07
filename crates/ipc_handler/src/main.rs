// use interprocess::local_socket::NameType;
use single_instance::SingleInstance;
use std::thread;
use std::time::Duration;

// pub fn ensure_single_instance(app_id: &str) {
//     let name = if NameType::query().contains(NameType::NAMESPACE) {};
// }

fn main() {
    let instance = SingleInstance::new("CoreLauncher").unwrap();

    if !instance.is_single() {
        println!("Another instance of CoreLauncher is already running! Closing...");
        return;
    }

    println!("Hello, world!");
    thread::sleep(Duration::from_secs(20));
}

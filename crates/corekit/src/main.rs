use corekit::Application;

fn main() {
    Application::new().run(|context| println!("eventloop created"));
}

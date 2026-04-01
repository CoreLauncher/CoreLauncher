use corekit::{Application, WindowOptions};

fn main() {
    Application::new().run(|context| {
        println!("eventloop created");

        context.open_window(WindowOptions::builder().build());
    });
}

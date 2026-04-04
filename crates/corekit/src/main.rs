use corekit::{Application, Component, WindowOptions};

struct Root;

impl Component for Root {}

fn main() {
    Application::new().run(|context| {
        println!("eventloop created");

        context.open_window(
            WindowOptions::builder()
                .with_root(Root)
                .with_title("CoreKit Test")
                .build(),
        );
    });
}

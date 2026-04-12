use corekit::{
    Application, Component, Element, div,
    style::{StyledElement, color::rgb},
    window::options::WindowOptions,
};

struct Root;

impl Component for Root {
    fn render(&self) -> Box<dyn Element> {
        return div().size_full().background_color(rgb(0, 255, 0)).into();
    }
}

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

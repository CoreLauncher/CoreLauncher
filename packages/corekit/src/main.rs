use corekit::{
    Application, Component, Element, ParentElement, div,
    style::{StyledElement, color::rgb},
    window::options::WindowOptions,
};

struct SubComponent;

impl Component for SubComponent {
    fn render(&self) -> Box<dyn Element> {
        return div().size_full().into();
    }
}

struct RootComponent;

impl Component for RootComponent {
    fn render(&self) -> Box<dyn Element> {
        return div()
            .size_full()
            .background_color(rgb(0.0, 1.0, 0.0))
            .child(Box::new(SubComponent {}))
            .into();
    }
}

fn main() {
    Application::new().run(|context| {
        println!("eventloop created");

        context.open_window(
            WindowOptions::builder()
                .with_root(RootComponent)
                .with_title("CoreKit Test")
                .build(),
        );
    });
}

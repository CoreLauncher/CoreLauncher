use crate::{
    assets::CustomAssets,
    components::{logo, title_bar},
    style::Style,
};
use gpui::{
    App, AppContext, Application, AssetSource, Bounds, Context, IntoElement, ParentElement, Pixels,
    Render, SharedString, Styled, TitlebarOptions, Window, WindowBounds, WindowDecorations,
    WindowOptions, div, px, size,
};
use gpui_component_assets::Assets as IconAssets;

mod assets;
mod components;
mod style;

struct RootView;

impl Render for RootView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .font_family("Inter")
            .bg(Style::background())
            .text_color(Style::text_color())
            .rounded(px(10.))
            .overflow_hidden()
            .size_full()
            .child(title_bar())
    }
}

fn main() {
    Application::new()
        .with_assets(IconAssets)
        .with_assets(CustomAssets)
        .run(|cx: &mut App| {
            cx.text_system()
                .add_fonts(vec![
                    CustomAssets
                        .load("inter/Inter-Regular.ttf")
                        .unwrap()
                        .unwrap(),
                ])
                .unwrap();

            println!("{:?}", IconAssets.list("").unwrap());
            println!("{:?}", CustomAssets.list("").unwrap());

            let bounds = Bounds::centered(None, size(px(1200.), px(800.0)), cx);
            cx.open_window(
                WindowOptions {
                    app_id: Some("corelauncher".to_string()),
                    window_min_size: Some(size(px(1200.0), px(800.0))),
                    window_bounds: Some(WindowBounds::Windowed(bounds)),
                    is_resizable: false,
                    titlebar: Some(TitlebarOptions {
                        title: Some(SharedString::new_static("CoreLauncher")),
                        appears_transparent: true,
                        ..Default::default()
                    }),
                    window_decorations: Some(WindowDecorations::Client),
                    ..Default::default()
                },
                |window, cx| {
                    window.set_window_title("CoreLauncher");
                    let view = cx.new(|_| RootView);
                    return view;
                },
            )
            .unwrap();
        });
}

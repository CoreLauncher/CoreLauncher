use std::fs;

use crate::{assets::CustomAssets, components::title_bar, constants::Constants, style::Style};
use gpui::{
    App, AppContext, Application, AssetSource, Bounds, Context, IntoElement, ParentElement, Render,
    SharedString, Styled, TitlebarOptions, Window, WindowBounds, WindowDecorations, WindowOptions,
    div, px, red, size,
};

mod assets;
mod components;
mod constants;
mod style;

struct RootView;

impl Render for RootView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .font_family("Inter")
            .bg(Style::background())
            .text_color(Style::text_color())
            .rounded(Style::window_rounding())
            .overflow_hidden()
            .size_full()
            .flex()
            .flex_col()
            .child(title_bar())
            .child(
                div()
                    .flex()
                    .flex_row()
                    .size_full()
                    .p(Style::normal_gap())
                    .child("Hello, World!"),
            )
    }
}

fn main() {
    println!("App Directory: {:?}", Constants::app_directory());
    let _ = fs::create_dir(Constants::app_directory());

    println!(
        "Embedded Assets: {}",
        CustomAssets.list("").unwrap().join(", ")
    );

    Application::new()
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
                    return cx.new(|_| RootView);
                },
            )
            .unwrap();
        });
}

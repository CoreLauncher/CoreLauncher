use std::fs;

use crate::{assets::CustomAssets, constants::Constants, sections::TitlebarSection, style::Style};
use gpui::{
    App, AppContext, Application, AssetSource, Bounds, Context, Entity, IntoElement, ParentElement,
    Render, SharedString, Styled, TitlebarOptions, Window, WindowBounds, WindowDecorations,
    WindowOptions, div, px, size,
};

mod assets;
mod components;
mod constants;
mod sections;
mod smart_components;
mod style;

struct SettingsView;

impl Render for SettingsView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div().child("Settings View")
    }
}

struct LibraryView;

impl Render for LibraryView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div().child("Library View")
    }
}

struct RootView {
    active_tab: String,
    settings_view: Entity<SettingsView>,
    library_view: Entity<LibraryView>,
}

impl Render for RootView {
    fn render(&mut self, window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .font_family("Inter")
            .text_color(Style::text_color())
            .rounded(Style::window_rounding())
            .overflow_hidden()
            .size_full()
            .flex()
            .flex_col()
            .bg(Style::background())
            .child(TitlebarSection::new(
                &self.active_tab,
                window.listener_for::<RootView, String>(
                    _cx.entity(),
                    |root, new_active_tab, _, _| {},
                ),
            ))
            .child(
                div()
                    .flex()
                    .flex_row()
                    .size_full()
                    .p(Style::normal_gap())
                    .child(self.library_view.clone()),
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
                        .load("fonts/inter/Inter-Regular.ttf")
                        .unwrap()
                        .unwrap(),
                    CustomAssets
                        .load("fonts/rubik/rubik-latin-700-normal.ttf")
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
                    // is_resizable: false,
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
                    return cx.new(|cx| RootView {
                        settings_view: cx.new(|_| SettingsView),
                        library_view: cx.new(|_| LibraryView),
                    });
                },
            )
            .unwrap();
        });
}

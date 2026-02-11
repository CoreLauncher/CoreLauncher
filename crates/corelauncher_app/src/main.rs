use std::fs;

use gpui::{
    App, AppContext, Application, AssetSource, Bounds, Context, Entity, IntoElement, ParentElement,
    Render, SharedString, Styled, TitlebarOptions, Window, WindowBounds, WindowDecorations,
    WindowOptions, div, prelude::FluentBuilder, px, size,
};

use crate::{
    assets::CustomAssets,
    constants::Constants,
    ui::{SettingsView, Style, TitlebarSection, window_root},
};

mod assets;
mod constants;
mod ui;

struct LibraryView;

impl Render for LibraryView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div().child("Library View")
    }
}

struct ProfileView;

impl Render for ProfileView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div().child("Profile View")
    }
}

struct RootView {
    active_tab: String,
    library_view: Entity<LibraryView>,
    profile_view: Entity<ProfileView>,
    settings_view: Entity<SettingsView>,
}

impl RootView {
    pub fn new(cx: &mut App) -> Entity<Self> {
        cx.new(|cx| RootView {
            active_tab: "library".to_string(),
            library_view: cx.new(|_| LibraryView),
            profile_view: cx.new(|_| ProfileView),
            settings_view: cx.new(|_| SettingsView),
        })
    }
}

impl Render for RootView {
    fn render(&mut self, window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .child(window_root())
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
                    &_cx.entity(),
                    |root, new_active_tab, _, _| {
                        root.active_tab = new_active_tab.clone();
                    },
                ),
            ))
            .child(
                div()
                    .flex()
                    .flex_row()
                    .size_full()
                    .p(Style::normal_gap())
                    .when(self.active_tab == "library", |element| {
                        element.child(self.library_view.clone())
                    })
                    .when(self.active_tab == "profile", |element| {
                        element.child(self.profile_view.clone())
                    })
                    .when(self.active_tab == "settings", |element| {
                        element.child(self.settings_view.clone())
                    }),
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
                .add_fonts(
                    CustomAssets
                        .list("fonts")
                        .unwrap()
                        .iter()
                        .map(|path| CustomAssets.load(&path.as_str()).unwrap().unwrap())
                        .collect(),
                )
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
                    return RootView::new(cx);
                },
            )
            .unwrap();
        });
}

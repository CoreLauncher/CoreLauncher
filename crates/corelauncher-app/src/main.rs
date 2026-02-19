use std::fs;

use corelauncher_plugin_steam::PluginSteam;
use gpui::{
    App, AppContext, Application, AssetSource, Bounds, Context, Entity, IntoElement, ParentElement,
    Pixels, Render, SharedString, Styled, TitlebarOptions, Window, WindowBounds, WindowDecorations,
    WindowOptions, div, prelude::FluentBuilder, px, size,
};
use image::EncodableLayout;
// use tray_icon::{
//     TrayIconBuilder, TrayIconEvent,
//     menu::{MenuEvent, MenuItem},
// };

use crate::{
    assets::CustomAssets,
    constants::Constants,
    plugins::manager::PluginManager,
    ui::{
        components::window_root::window_root,
        sections::titlebar_section::TitlebarSection,
        style::Style,
        views::{
            library_view::LibraryView, profile_view::ProfileView, settings_view::SettingsView,
        },
    },
};

mod assets;
mod constants;
mod plugins;
mod ui;

struct RootView {
    #[allow(dead_code)]
    plugin_manager: PluginManager,
    active_tab: String,
    library_view: Entity<LibraryView>,
    profile_view: Entity<ProfileView>,
    settings_view: Entity<SettingsView>,
}

impl RootView {
    pub fn new(cx: &mut App, plugin_manager: PluginManager) -> Entity<Self> {
        cx.new(|cx| RootView {
            plugin_manager,
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
            .border_color(Style::border_color())
            .border_2()
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

fn window_options(bounds: Bounds<Pixels>) -> WindowOptions {
    WindowOptions {
        app_id: Some("corelauncher".to_string()),
        window_min_size: Some(size(px(1000.0), px(600.0))),
        window_bounds: Some(WindowBounds::Windowed(bounds)),
        titlebar: Some(TitlebarOptions {
            title: Some(SharedString::new_static("CoreLauncher")),
            appears_transparent: true,
            ..Default::default()
        }),
        window_decorations: Some(WindowDecorations::Client),
        ..Default::default()
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
                        .filter(|path| path.ends_with(".ttf"))
                        .map(|path| CustomAssets.load(&path.as_str()).unwrap().unwrap())
                        .collect(),
                )
                .unwrap();

            std::thread::spawn(|| {
                use tray::{Icon, MouseButton, TrayIconBuilder, TrayIconEvent};

                let image = image::load_from_memory(
                    CustomAssets
                        .load("logos/logo.ico")
                        .unwrap()
                        .unwrap()
                        .as_bytes(),
                )
                .unwrap()
                .into_rgba8();

                let (width, height) = image.dimensions();

                let icon = Icon::from_rgba(image.into_raw(), width, height).unwrap();

                let tray = TrayIconBuilder::new()
                    .with_tooltip("My App")
                    .with_icon(icon)
                    .build()
                    .unwrap();

                // Poll for events
                let receiver = TrayIconEvent::receiver();
                loop {
                    if let Ok(event) = receiver.recv() {
                        match event {
                            TrayIconEvent::Click {
                                button: MouseButton::Right,
                                position,
                                ..
                            } => {
                                println!("Right click at position: {:?}", position);
                            }
                            TrayIconEvent::Click {
                                button: MouseButton::Left,
                                position,
                                ..
                            } => {
                                println!("Left click at position: {:?}", position);
                            }
                            _ => {
                                println!("Other event: {:?}", event);
                            }
                        }
                    }
                }
            });

            let mut plugin_manager = PluginManager::new(Box::new(|event| {
                println!("Plugin event: {:?}", event);
            }));

            plugin_manager.register_plugin(Box::new(|portal| Box::new(PluginSteam::new(portal))));

            println!("Loaded {} plugins", plugin_manager.plugin_count());
            for plugin in plugin_manager.plugins() {
                println!(
                    " - {} v{}: {}",
                    plugin.get_name(),
                    plugin.get_version(),
                    plugin.get_description()
                );
            }

            let state = RootView::new(cx, plugin_manager);

            let bounds = Bounds::centered(None, size(px(1200.), px(800.0)), cx);
            let options = window_options(bounds);

            cx.open_window(options, |window, _cx| {
                window.set_window_title("CoreLauncher");
                return state;
            })
            .unwrap();
        });
}

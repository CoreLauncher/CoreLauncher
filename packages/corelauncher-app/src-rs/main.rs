use std::{borrow::Cow, fs, path::PathBuf, thread};

use crate::{assets::Assets, constants::Constants, plugins::manager::PluginManager};
use corelauncher_types::{AccountInstanceInfo, AccountProviderInfo, PluginEvent};
use serde::{Deserialize, Serialize};
use tao::{
    dpi::LogicalSize,
    event_loop::{ControlFlow, EventLoop, EventLoopBuilder},
    window::WindowBuilder,
};
use wry::{WebViewBuilder, http::Response};

mod assets;
mod constants;
mod plugins;

/// Command that is sent from the frontend to the backend.
#[derive(Debug, Deserialize)]
#[serde(tag = "type", content = "payload")]
#[serde(rename_all = "snake_case", rename_all_fields = "camelCase")]
pub enum IPCCommand {
    WebviewInitialized,
    WindowDrag,
    AccountConnect {
        plugin_id: String,
        provider_id: String,
    },
    AccountDisconnect {
        plugin_id: String,
        provider_id: String,
        instance_id: String,
    },
}

#[derive(Debug, Serialize)]
#[serde(tag = "type", content = "payload")]
#[serde(rename_all = "snake_case")]
pub enum IPCEvent {
    AccountProvidersUpdated(Vec<AccountProviderInfo>),
    AccountInstancesUpdated(Vec<AccountInstanceInfo>),
}

#[derive(Debug)]
enum UserEvent {
    /// Command that is sent from the frontend to the backend.
    IPCCommand(IPCCommand),
    /// Event that is emitted by a plugin
    PluginEvent(PluginEvent),
    /// Emitted when another instance of CoreLauncher forwards its arguments.
    SingleInstanceLockEvent(Vec<String>),
}

struct Window {
    window: tao::window::Window,
    webview: wry::WebView,
    pub ipc_receiver: Option<std::sync::mpsc::Receiver<IPCCommand>>,
}

impl Window {
    fn new(event_loop: &EventLoop<UserEvent>) -> Self {
        let (ipc_sender, ipc_receiver) = std::sync::mpsc::channel::<IPCCommand>();

        let window = WindowBuilder::new()
            .with_title("CoreLauncher")
            .with_inner_size(LogicalSize::new(1200, 800))
            .with_decorations(false)
            .with_transparent(true)
            .build(event_loop)
            .unwrap();

        let webview_builder = WebViewBuilder::new()
            .with_transparent(true)
            .with_ipc_handler(move |request| {
                let body = request.body();
                let data = serde_json::from_str::<IPCCommand>(body);

                if let Ok(event) = data {
                    ipc_sender.send(event).unwrap();
                } else {
                    tracing::error!("Failed to parse IPC event: {:?}", data);
                }
            })
            .with_custom_protocol("corelauncher-webview".into(), |_, request| {
                let uri = request.uri().to_string();
                let mut path = uri.split("://").last().unwrap_or("index.html");

                if path == "index.html/" {
                    path = "index.html";
                } else if path.starts_with("index.html/") {
                    path = &path["index.html/".len()..];
                }

                let file = Assets::get(path);
                let mime = mime_guess::from_path(path).first_or_octet_stream();

                if let Some(file) = file {
                    return Response::builder()
                        .header("content-type", mime.to_string())
                        .body(file.data)
                        .unwrap();
                } else {
                    return Response::builder()
                        .status(404)
                        .header("content-type", "text/plain")
                        .body(Cow::Owned("404 Not Found".into()))
                        .unwrap();
                }
            });

        #[cfg(not(debug_assertions))]
        let webview_builder = webview_builder.with_url("corelauncher-webview://index.html");
        #[cfg(debug_assertions)]
        let webview_builder = webview_builder.with_url("http://localhost:3000");

        #[cfg(not(target_os = "linux"))]
        let webview = webview_builder.build(&window).unwrap();
        #[cfg(target_os = "linux")]
        let webview = {
            use tao::platform::unix::WindowExtUnix;
            use wry::WebViewBuilderExtUnix;

            let vbox = window.default_vbox().unwrap();
            webview_builder.build_gtk(vbox).unwrap()
        };

        #[cfg(debug_assertions)]
        webview.open_devtools();

        Self {
            window,
            webview,
            ipc_receiver: Some(ipc_receiver),
        }
    }

    fn dispatch_event(&self, event: IPCEvent) {
        let js = format!(
            "window.dispatchEvent(new CustomEvent('corelauncher:plugin-event', {{ detail: {} }}));",
            serde_json::to_string(&event).unwrap()
        );
        self.webview
            .evaluate_script(js.as_str())
            .expect("Failed to evaluate script");
    }
}

struct CoreLauncher {
    main_window: Window,
    plugin_manager: PluginManager,
}

impl CoreLauncher {
    fn new(event_loop: &EventLoop<UserEvent>, app_directory: PathBuf) -> Self {
        let mut plugin_manager = PluginManager::new(app_directory);
        plugin_manager.register_plugin(Box::new(|portal| {
            Box::new(corelauncher_plugin_steam::SteamPlugin::new(portal))
        }));

        plugin_manager.register_plugin(Box::new(|portal| {
            Box::new(corelauncher_plugin_minecraft::MinecraftPlugin::new(portal))
        }));

        Self {
            main_window: Window::new(&event_loop),
            plugin_manager,
        }
    }
}

#[tokio::main]
async fn main() {
    #[cfg(target_os = "linux")]
    unsafe {
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        std::env::set_var("LC_ALL", "C");
    }

    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    let app_directory = Constants::app_directory();
    tracing::info!("App Directory: {:?}", app_directory);
    let _ = fs::create_dir(&app_directory);

    #[cfg(all(debug_assertions, target_os = "linux"))]
    {
        tracing::info!("Writing desktop files");

        let home = std::env::home_dir().expect("Could not determine home directory");
        let cwd = std::env::current_dir()
            .expect("Could not determine current directory")
            .to_string_lossy()
            .to_string();
        let exec = std::env::current_exe()
            .expect("Could not determine current executable")
            .to_string_lossy()
            .to_string();

        let desktop_content = include_str!("../../../assets/desktop/development.desktop")
            .replace("{CWD}", &cwd)
            .replace("{EXEC}", &exec);

        let applications_dir = home.join(".local/share/applications");
        let _ = fs::create_dir_all(&applications_dir);
        fs::write(
            applications_dir.join("corelauncher_development.desktop"),
            &desktop_content,
        )
        .expect("Failed to write desktop file");

        let icon_dir = home.join(".local/share/icons/hicolor/scalable/apps");
        let _ = fs::create_dir_all(&icon_dir);
        fs::write(
            icon_dir.join("corelauncher_development.svg"),
            include_bytes!("../../../assets/logos/logo.svg"),
        )
        .expect("Failed to write icon file");

        let _ = std::process::Command::new("update-desktop-database")
            .arg(&applications_dir)
            .output();
    }

    let event_loop = EventLoopBuilder::with_user_event().build();

    {
        let event_proxy = event_loop.create_proxy();
        let lock = singleinstancelock::SingleInstanceLock::new("corelauncher");
        if lock.forward_arguments() {
            tracing::info!("Another instance is already running. Forwarded arguments and exiting.");
            std::process::exit(0);
        }
        thread::spawn(move || {
            loop {
                let Some(arguments) = lock.incoming() else {
                    continue;
                };
                let _ = event_proxy.send_event(UserEvent::SingleInstanceLockEvent(arguments));
            }
        });
    }

    let mut app = CoreLauncher::new(&event_loop, app_directory);

    {
        let event_proxy = event_loop.create_proxy();
        let plugin_receiver = app.plugin_manager.event_receiver.take().unwrap();
        thread::spawn(move || {
            loop {
                if let Ok(event) = plugin_receiver.recv() {
                    event_proxy
                        .send_event(UserEvent::PluginEvent(event))
                        .ok();
                }
            }
        });
    }

    {
        let event_proxy = event_loop.create_proxy();
        let ipc_receiver = app.main_window.ipc_receiver.take().unwrap();
        thread::spawn(move || {
            loop {
                if let Ok(event) = ipc_receiver.recv() {
                    event_proxy
                        .send_event(UserEvent::IPCCommand(event))
                        .ok();
                }
            }
        });
    }

    let handle = tokio::runtime::Handle::current();
    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;

        match event {
            tao::event::Event::WindowEvent { event, .. } => match event {
                tao::event::WindowEvent::CloseRequested => {
                    *control_flow = ControlFlow::Exit;
                }
                _ => {}
            },
            tao::event::Event::UserEvent(user_event) => {
                tracing::info!("Received user event: {:#?}", user_event);
                match user_event {
                    UserEvent::IPCCommand(ipc_event) => match ipc_event {
                        IPCCommand::WebviewInitialized => {
                            let events = app.plugin_manager.setup_events();
                            for event in events {
                                app.main_window.dispatch_event(event);
                            }
                        }
                        IPCCommand::WindowDrag => {
                            app.main_window.window.drag_window().unwrap();
                        }
                        IPCCommand::AccountConnect {
                            plugin_id,
                            provider_id,
                        } => {
                            tokio::task::block_in_place(|| {
                                handle.block_on(
                                    app.plugin_manager
                                        .emit_connect_account_instance(&plugin_id, &provider_id),
                                )
                            })
                            .ok();
                        }
                        IPCCommand::AccountDisconnect {
                            plugin_id,
                            provider_id,
                            instance_id,
                        } => {
                            tokio::task::block_in_place(|| {
                                handle.block_on(
                                    app.plugin_manager.emit_disconnect_account_instance(
                                        &plugin_id,
                                        &provider_id,
                                        &instance_id,
                                    ),
                                )
                            })
                            .ok();
                        }
                    },
                    UserEvent::PluginEvent(plugin_event) => {
                        tracing::info!("Received plugin event: {:#?}", plugin_event);

                        let mapped_event = match plugin_event {
                            PluginEvent::FocusMainWindow => {
                                #[cfg(not(target_os = "linux"))]
                                app.main_window.window.set_focus();

                                #[cfg(target_os = "linux")]
                                {
                                    // Hacky workaround for Linux, since set_focus() doesn't work on Linux with GTK3
                                    // https://github.com/tauri-apps/tauri/issues/5620#issuecomment-1704340661
                                    app.main_window.window.set_visible(false);
                                    app.main_window.window.set_visible(true);
                                }

                                return;
                            }

                            PluginEvent::AccountProvidersUpdated => {
                                let providers = app.plugin_manager.get_account_providers();
                                let info = providers.iter().map(|p| p.into_info());

                                IPCEvent::AccountProvidersUpdated(info.collect())
                            }
                            PluginEvent::AccountInstancesUpdated => {
                                let instances = app.plugin_manager.get_account_instances();
                                let info = instances.iter().map(|i| i.into_info());

                                IPCEvent::AccountInstancesUpdated(info.collect())
                            }
                        };

                        app.main_window.dispatch_event(mapped_event);
                    }
                    UserEvent::SingleInstanceLockEvent(arguments) => {
                        tracing::info!("Received arguments from another instance: {:?}", arguments);

                        if let Some(Ok(mut url)) = arguments.get(1).map(|s| url::Url::parse(s)) {
                            if url.scheme() == "corelauncher"
                                || url.scheme() == "corelauncher-development"
                            {
                                if let Some(host) = url.host_str().map(String::from) {
                                    url.set_path(&format!("{}{}", host, url.path()));
                                }
                                let _ = url.set_host(None);
                                tracing::info!("Protocol launched: {url:#?}");
                                tokio::task::block_in_place(|| {
                                    handle.block_on(
                                        app.plugin_manager.emit_protocol_launched(url.as_str()),
                                    )
                                });
                            }
                        }
                    }
                }
            }
            _ => {}
        }
    });
}

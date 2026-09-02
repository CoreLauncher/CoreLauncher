use std::{borrow::Cow, fs, thread};

use crate::{assets::Assets, constants::Constants, plugins::manager::PluginManager};
use corelauncher_types::PluginEvent;
use serde::Deserialize;
use tao::{
    dpi::LogicalSize,
    event_loop::{ControlFlow, EventLoop, EventLoopBuilder},
    window::WindowBuilder,
};
use wry::{WebViewBuilder, http::Response};

mod assets;
mod constants;
mod plugins;

#[derive(Debug, Deserialize)]
#[serde(tag = "type", content = "payload")]
#[serde(rename_all = "snake_case")]
enum IPCEvent {
    WebviewInitialized,
    WindowDrag,
    AccountConnect { id: String },
}

#[derive(Debug)]
enum UserEvent {
    IPCEvent(IPCEvent),
    PluginEvent(PluginEvent),
}

struct Window {
    window: tao::window::Window,
    webview: wry::WebView,
    pub ipc_receiver: Option<std::sync::mpsc::Receiver<IPCEvent>>,
}

impl Window {
    fn new(event_loop: &EventLoop<UserEvent>) -> Self {
        let (ipc_sender, ipc_receiver) = std::sync::mpsc::channel::<IPCEvent>();

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
                let data = serde_json::from_str::<IPCEvent>(body);

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

            unsafe {
                std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
            }

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

    fn dispatch_event(&self, event: PluginEvent) {
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
    fn new(event_loop: &EventLoop<UserEvent>) -> Self {
        let mut plugin_manager = PluginManager::new();
        plugin_manager.register_plugin(Box::new(|portal| {
            Box::new(corelauncher_plugin_steam::PluginSteam::new(portal))
        }));

        plugin_manager.register_plugin(Box::new(|portal| {
            Box::new(corelauncher_plugin_minecraft::PluginMinecraft::new(portal))
        }));

        Self {
            main_window: Window::new(&event_loop),
            plugin_manager,
        }
    }
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();
    tracing::info!("App Directory: {:?}", Constants::app_directory());
    let _ = fs::create_dir(Constants::app_directory());

    let event_loop = EventLoopBuilder::with_user_event().build();
    let mut app = CoreLauncher::new(&event_loop);

    {
        let event_proxy = event_loop.create_proxy();
        let plugin_receiver = app.plugin_manager.event_receiver.take().unwrap();
        thread::spawn(move || {
            loop {
                if let Ok(event) = plugin_receiver.recv() {
                    event_proxy
                        .send_event(UserEvent::PluginEvent(event))
                        .unwrap();
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
                    event_proxy.send_event(UserEvent::IPCEvent(event)).unwrap();
                }
            }
        });
    }

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
                    UserEvent::IPCEvent(ipc_event) => match ipc_event {
                        IPCEvent::WebviewInitialized => {
                            let events = app.plugin_manager.setup_events();
                            for event in events {
                                app.main_window.dispatch_event(event);
                            }
                        }
                        IPCEvent::WindowDrag => {
                            app.main_window.window.drag_window().unwrap();
                        }
                        IPCEvent::AccountConnect { id } => {
                            let provider = app.plugin_manager.get_account_provider(id);
                            if let Some(provider) = provider {
                                provider.connect().ok();
                            }
                        }
                    },
                    UserEvent::PluginEvent(plugin_event) => {
                        tracing::info!("Received plugin event: {:#?}", plugin_event);
                        app.main_window.dispatch_event(plugin_event);
                    }
                }
            }
            _ => {}
        }
    });
}

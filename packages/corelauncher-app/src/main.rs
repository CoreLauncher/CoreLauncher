use std::{borrow::Cow, fs, thread};

use crate::{assets::Assets, constants::Constants};
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
    WindowDrag,
}

#[derive(Debug)]
enum UserEvent {
    IPCEvent(IPCEvent),
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
            .with_inner_size(LogicalSize::new(1200, 800))
            .with_decorations(false)
            .build(event_loop)
            .unwrap();

        let webview_builder = WebViewBuilder::new()
            .with_ipc_handler(move |request| {
                let body = request.body();
                let data = serde_json::from_str::<IPCEvent>(body);

                if let Ok(event) = data {
                    ipc_sender.send(event).unwrap();
                } else {
                    eprintln!("Failed to parse IPC event: {:?}", data);
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

        webview.open_devtools();

        Self {
            window,
            webview,
            ipc_receiver: Some(ipc_receiver),
        }
    }
}

struct CoreLauncher {
    main_window: Option<Window>,
}

impl CoreLauncher {
    fn new() -> Self {
        Self { main_window: None }
    }
}

#[tokio::main]
async fn main() {
    println!("App Directory: {:?}", Constants::app_directory());
    let _ = fs::create_dir(Constants::app_directory());

    let event_loop = EventLoopBuilder::with_user_event().build();
    let event_proxy = event_loop.create_proxy();

    let mut app = CoreLauncher::new();
    let mut window = Window::new(&event_loop);
    let ipc_receiver = window.ipc_receiver.take().unwrap();
    thread::spawn(move || {
        loop {
            if let Ok(event) = ipc_receiver.recv() {
                event_proxy.send_event(UserEvent::IPCEvent(event)).unwrap();
            }
        }
    });
    app.main_window = Some(window);

    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;

        match event {
            tao::event::Event::UserEvent(event) => {
                println!("Received user event: {:#?}", event);
                app.main_window
                    .as_ref()
                    .unwrap()
                    .window
                    .drag_window()
                    .unwrap();
            }
            _ => {}
        }
    });
}

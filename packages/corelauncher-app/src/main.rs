use std::{borrow::Cow, fs};

use crate::{assets::Assets, constants::Constants};
use tao::{
    event_loop::{ControlFlow, EventLoop},
    window::WindowBuilder,
};
use wry::{WebViewBuilder, http::Response};

mod assets;
mod constants;
mod plugins;

struct Window {
    window: tao::window::Window,
    webview: wry::WebView,
}

impl Window {
    fn new(event_loop: &EventLoop<()>) -> Self {
        let window = WindowBuilder::new().build(event_loop).unwrap();

        let webview_builder = WebViewBuilder::new()
            .with_url("corelauncher-webview://index.html")
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
                println!("{:#?} {:#?}", path, file.is_some());

                if let Some(file) = file {
                    return Response::builder()
                        .header("content-type", mime.to_string())
                        .body(file.data)
                        .unwrap();
                } else {
                    return Response::builder()
                        .status(404)
                        .header("content-type", mime.to_string())
                        .body(Cow::Owned("404 Not Found".into()))
                        .unwrap();
                }
            });

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

        Self { window, webview }
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

fn main() {
    println!("App Directory: {:?}", Constants::app_directory());
    let _ = fs::create_dir(Constants::app_directory());

    let event_loop = EventLoop::new();

    let mut app = CoreLauncher::new();
    let window = Window::new(&event_loop);
    app.main_window = Some(window);

    event_loop.run(move |_, _, control_flow| {
        *control_flow = ControlFlow::Wait;
    });
}

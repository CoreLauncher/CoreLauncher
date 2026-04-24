use std::sync::{Arc, Mutex};

use cosmic_text::{Attrs, Buffer, FontSystem, Metrics, Shaping, SwashCache};
use taffy::{AvailableSpace, TaffyTree};
use winit::{
    application::ApplicationHandler,
    dpi::{PhysicalSize, Size},
    event::WindowEvent,
    event_loop::{self, EventLoop, EventLoopProxy},
    window::WindowAttributes,
};

use crate::{
    Component, Element,
    context::ApplicationContext,
    rendering::{PaintOperation, Renderer, new_wgpu_renderer},
    style::color::rgba,
    window::options::WindowOptions,
};

pub enum UserEvent {
    OpenWindow { options: WindowOptions },
}

pub struct Window {
    handle: Arc<winit::window::Window>,
    root: Box<dyn Component>,
}

impl Window {
    fn new(window: winit::window::Window, root: Box<dyn Component>) -> Self {
        Self {
            handle: Arc::new(window),
            root,
        }
    }

    fn render(&self) -> Vec<PaintOperation> {
        let mut tree = TaffyTree::<()>::new();
        let node = self.root.taffy_layout(&mut tree);
        let size = self.handle.inner_size();
        tree.compute_layout(
            node,
            taffy::Size {
                width: AvailableSpace::Definite(size.width as f32),
                height: AvailableSpace::Definite(size.height as f32),
            },
        )
        .unwrap();
        tree.print_tree(node);

        let mut font_system = FontSystem::new();
        let mut swash_cache = SwashCache::new();
        let metrics = Metrics::new(32.0, 20.0);
        let mut buffer = Buffer::new(&mut font_system, metrics);
        buffer.set_size(&mut font_system, Some(200.0), Some(25.0));
        let attrs = Attrs::new();
        buffer.set_text(
            &mut font_system,
            "Hello, Rust!",
            &attrs,
            Shaping::Advanced,
            None,
        );
        buffer.shape_until_scroll(&mut font_system, true);

        let mut operations = Vec::new();

        for run in buffer.layout_runs() {
            for glyph in run.glyphs.iter() {
                let glyph = glyph.physical((10.0, 10.0), 1.0);
                swash_cache.with_pixels(
                    &mut font_system,
                    glyph.cache_key,
                    cosmic_text::Color::rgb(255, 255, 255),
                    |x, y, color| {
                        operations.push(PaintOperation::Rectangle {
                            x: (glyph.x + x) as u32,
                            y: (glyph.y + y + 32) as u32,
                            width: 1,
                            height: 1,
                            color: rgba(color.r(), color.g(), color.b(), color.a()),
                        });
                    },
                );
            }
        }

        return operations;
    }
}

pub struct ApplicationState {
    windows: Vec<Window>,
}

impl ApplicationState {
    fn new() -> Self {
        Self {
            windows: Vec::new(),
        }
    }
}

pub struct Application {
    started: bool,
    callback: Box<dyn FnMut(ApplicationContext)>,
    proxy: Option<EventLoopProxy<UserEvent>>,
    renderer: Box<dyn Renderer>,
    app_state: Option<Arc<Mutex<ApplicationState>>>,
}

impl Application {
    pub fn new() -> Self {
        Self {
            started: false,
            callback: Box::new(|_| {}),
            proxy: None,
            renderer: new_wgpu_renderer(),
            app_state: None,
        }
    }

    pub fn run<F>(&mut self, callback: F)
    where
        F: FnMut(ApplicationContext) + 'static,
    {
        self.callback = Box::new(callback);

        let event_loop = EventLoop::<UserEvent>::with_user_event()
            .build()
            .expect("Could not create eventloop");

        let proxy = event_loop.create_proxy();
        self.proxy = proxy.into();

        let app_state = ApplicationState::new();
        self.app_state = Arc::new(Mutex::new(app_state)).into();

        event_loop.run_app(self).expect("Running eventloop failed");
    }
}

impl ApplicationHandler<UserEvent> for Application {
    fn resumed(&mut self, _event_loop: &event_loop::ActiveEventLoop) {
        if self.started {
            return;
        } else {
            self.started = true
        };

        (self.callback)(ApplicationContext::new(
            self.app_state.as_ref().unwrap().clone(),
            self.proxy.as_ref().unwrap().clone(),
        ));
    }

    fn window_event(
        &mut self,
        event_loop: &event_loop::ActiveEventLoop,
        window_id: winit::window::WindowId,
        event: WindowEvent,
    ) {
        if matches!(event, WindowEvent::Destroyed) {
            return;
        }

        let mut app_state = self.app_state.as_ref().unwrap().lock().unwrap();
        let mut window_option = app_state
            .windows
            .iter_mut()
            .find(|window| window.handle.id() == window_id);

        let window = window_option
            .as_mut()
            .expect("Event emitted for window that did not exist");

        match event {
            WindowEvent::CloseRequested => {
                self.renderer.deregister_window(window.handle.clone());

                let handle = window.handle.clone();
                app_state
                    .windows
                    .retain(|w| !Arc::ptr_eq(&w.handle, &handle));

                event_loop.exit();
            }
            WindowEvent::Resized(size) => {
                self.renderer
                    .resize_window(window.handle.clone(), size.width, size.height);
            }
            WindowEvent::RedrawRequested => {
                let operations = window.render();

                self.renderer
                    .render_window(window.handle.clone(), operations);
            }
            WindowEvent::CursorMoved {
                device_id: _device_id,
                position: _position,
            } => (),
            _ => println!("{:?}", event),
        }
    }

    fn user_event(&mut self, event_loop: &event_loop::ActiveEventLoop, event: UserEvent) {
        let mut app_state = self.app_state.as_ref().unwrap().lock().unwrap();

        match event {
            UserEvent::OpenWindow { options } => {
                let mut attributes = WindowAttributes::default();
                attributes = attributes.with_title(options.title);
                attributes = attributes.with_min_inner_size(Size::Physical(PhysicalSize {
                    width: options.minimum_size.0,
                    height: options.minimum_size.1,
                }));

                let handle = event_loop.create_window(attributes).unwrap();
                let window = Window::new(handle, options.root);

                self.renderer.register_window(window.handle.clone());

                app_state.windows.push(window);
            }
        }
    }
}

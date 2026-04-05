use std::sync::{Arc, Mutex};

use winit::{
    application::ApplicationHandler,
    event::WindowEvent,
    event_loop::{self, EventLoop, EventLoopProxy},
    window::WindowAttributes,
};

use crate::{
    WindowOptions,
    context::ApplicationContext,
    rendering::{Renderer, new_wgpu_renderer},
};

pub enum UserEvent {
    OpenWindow { options: WindowOptions },
}

#[derive(Debug)]
pub struct Window {
    handle: Arc<winit::window::Window>,
}

impl Window {
    fn new(window: winit::window::Window) -> Self {
        Self {
            handle: Arc::new(window),
        }
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
                self.renderer.render_window(window.handle.clone());
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

                let handle = event_loop.create_window(attributes).unwrap();
                let window = Window::new(handle);

                self.renderer.register_window(window.handle.clone());

                app_state.windows.push(window);
            }
        }
    }
}

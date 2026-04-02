use std::sync::{Arc, Mutex};

use winit::{
    application::ApplicationHandler,
    event_loop::{self, EventLoop, EventLoopProxy},
    window::{Window, WindowAttributes},
};

use crate::{WindowOptions, context::ApplicationContext};

#[derive(Debug)]
pub enum UserEvent {
    OpenWindow { options: WindowOptions },
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
    state: Option<Arc<Mutex<ApplicationState>>>,
}

impl Application {
    pub fn new() -> Self {
        Self {
            started: false,
            callback: Box::new(|_| {}),
            proxy: None,
            state: None,
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

        let state = ApplicationState::new();
        self.state = Arc::new(Mutex::new(state)).into();

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
            self.state.as_ref().unwrap().clone(),
            self.proxy.as_ref().unwrap().clone(),
        ));
    }

    fn window_event(
        &mut self,
        event_loop: &event_loop::ActiveEventLoop,
        window_id: winit::window::WindowId,
        event: winit::event::WindowEvent,
    ) {
    }

    fn user_event(&mut self, event_loop: &event_loop::ActiveEventLoop, event: UserEvent) {
        match event {
            UserEvent::OpenWindow { options } => {
                let mut attributes = WindowAttributes::default();
                attributes = attributes.with_title(options.title);

                let window = event_loop.create_window(attributes).unwrap();

                self.state
                    .as_ref()
                    .unwrap()
                    .lock()
                    .unwrap()
                    .windows
                    .push(window);
            }
        }
    }
}

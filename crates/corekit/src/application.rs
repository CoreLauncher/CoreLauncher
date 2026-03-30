use winit::{
    application::ApplicationHandler,
    event_loop::{self, EventLoop, EventLoopProxy},
};

use crate::context::ApplicationContext;

enum UserEvent {}

pub struct Application {
    started: bool,
    callback: Box<dyn FnMut(ApplicationContext)>,
    proxy: Option<EventLoopProxy<UserEvent>>,
}

impl Application {
    pub fn new() -> Self {
        Self {
            started: false,
            callback: Box::new(|_| {}),
            proxy: None,
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

        event_loop.run_app(self).expect("Running eventloop failed");
    }
}

impl ApplicationHandler<UserEvent> for Application {
    fn resumed(&mut self, event_loop: &event_loop::ActiveEventLoop) {
        if self.started {
            return;
        } else {
            self.started = true
        };

        (self.callback)(ApplicationContext {});
    }

    fn window_event(
        &mut self,
        event_loop: &event_loop::ActiveEventLoop,
        window_id: winit::window::WindowId,
        event: winit::event::WindowEvent,
    ) {
    }
}

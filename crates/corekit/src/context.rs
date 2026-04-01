use std::sync::{Arc, Mutex};

use winit::event_loop::EventLoopProxy;

use crate::{
    application::{ApplicationState, UserEvent},
    options::WindowOptions,
};

pub struct ApplicationContext {
    state: Arc<Mutex<ApplicationState>>,
    proxy: EventLoopProxy<UserEvent>,
}

impl ApplicationContext {
    pub fn new(state: Arc<Mutex<ApplicationState>>, proxy: EventLoopProxy<UserEvent>) -> Self {
        Self { state, proxy }
    }

    pub fn open_window(&self, options: WindowOptions) {
        self.proxy
            .send_event(UserEvent::OpenWindow { options })
            .unwrap();
    }
}

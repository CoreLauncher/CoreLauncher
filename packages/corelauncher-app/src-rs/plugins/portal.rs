use std::sync::mpsc::Sender;

use corelauncher_types::{PluginEvent, PluginPortal};

pub struct PluginPortalImpl {
    event_sender: Sender<PluginEvent>,
}

impl PluginPortalImpl {
    pub fn new(event_sender: Sender<PluginEvent>) -> Self {
        Self { event_sender }
    }
}

impl PluginPortal for PluginPortalImpl {
    fn emit(&self, event: PluginEvent) {
        self.event_sender
            .send(event)
            .expect("Failed to send event to the event emitter");
    }
}

use std::{path::PathBuf, sync::mpsc::Sender};

use corelauncher_types::{PluginEvent, PluginPortal};

pub struct PluginPortalImpl {
    event_sender: Sender<PluginEvent>,
    data_directory: PathBuf,
}

impl PluginPortalImpl {
    pub fn new(event_sender: Sender<PluginEvent>, data_directory: PathBuf) -> Self {
        Self {
            event_sender,
            data_directory,
        }
    }
}

impl PluginPortal for PluginPortalImpl {
    fn emit(&self, event: PluginEvent) {
        self.event_sender
            .send(event)
            .expect("Failed to send event to the event emitter");
    }

    fn get_data_directory(&self, plugin_id: String) -> PathBuf {
        self.data_directory.join("plugins").join(plugin_id)
    }
}

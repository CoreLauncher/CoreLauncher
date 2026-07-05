use std::sync::{Arc, mpsc};

use corelauncher_types::{Plugin, PluginEvent};

use crate::plugins::portal::PluginPortalImpl;

pub struct PluginManager {
    portal: Arc<Box<dyn corelauncher_types::PluginPortal>>,
    plugins: Vec<Box<dyn Plugin>>,
    pub event_receiver: mpsc::Receiver<PluginEvent>,
}

type PluginConstructor =
    dyn FnOnce(Arc<Box<dyn corelauncher_types::PluginPortal>>) -> Box<dyn Plugin>;

impl PluginManager {
    pub fn new() -> Self {
        let (event_sender, event_receiver) = mpsc::channel::<PluginEvent>();
        Self {
            portal: Arc::new(Box::new(PluginPortalImpl::new(event_sender))),
            plugins: Vec::new(),
            event_receiver,
        }
    }

    pub fn register_plugin(&mut self, plugin_constructor: Box<PluginConstructor>) {
        self.plugins.push(plugin_constructor(self.portal.clone()));
    }

    #[allow(dead_code)]
    pub fn plugins(&self) -> Vec<&dyn Plugin> {
        self.plugins.iter().map(|c| c.as_ref()).collect()
    }

    #[allow(dead_code)]
    pub fn get_plugin(&self, id: &str) -> Option<&dyn Plugin> {
        self.plugins
            .iter()
            .find(|p| p.get_id() == id)
            .map(|p| p.as_ref())
    }
}

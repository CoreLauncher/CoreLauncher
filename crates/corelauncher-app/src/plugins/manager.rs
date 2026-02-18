use std::sync::Arc;

use corelauncher_types::{Plugin, PluginEventCallback};

use crate::plugins::container::PluginContainer;

pub struct PluginManager {
    containers: Vec<PluginContainer>,
    callback: Arc<PluginEventCallback>,
}

impl PluginManager {
    pub fn new(event_callback: PluginEventCallback) -> Self {
        Self {
            containers: Vec::new(),
            callback: Arc::new(event_callback),
        }
    }

    pub fn register_plugin(&mut self, plugin: Box<dyn Plugin>) {
        let container = PluginContainer::new(plugin, Arc::clone(&self.callback));
        self.containers.push(container);
    }

    pub fn plugins(&self) -> Vec<&dyn Plugin> {
        self.containers.iter().map(|c| c.plugin()).collect()
    }

    #[allow(dead_code)]
    pub fn get_plugin(&self, id: &str) -> Option<&dyn Plugin> {
        self.containers
            .iter()
            .find(|c| c.plugin().id() == id)
            .map(|c| c.plugin())
    }

    pub fn plugin_count(&self) -> usize {
        self.containers.len()
    }
}

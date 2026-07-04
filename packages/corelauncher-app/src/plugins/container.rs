use std::sync::Arc;

use corelauncher_types::{Plugin, PluginEventCallback, PluginLoader};

use crate::plugins::portal::PluginPortalImpl;

pub struct PluginContainer {
    callback: Arc<PluginEventCallback>,
    loader: PluginLoader,
    plugin: Option<Box<dyn Plugin>>,
}

impl PluginContainer {
    pub fn new(loader: PluginLoader, callback: Arc<PluginEventCallback>) -> Self {
        Self {
            callback,
            loader,
            plugin: None,
        }
    }

    pub fn enable(&mut self) {
        if self.is_enabled() {
            panic!("Tried to enabled an already enabled plugin!");
        };

        let portal = PluginPortalImpl::new(Arc::clone(&self.callback));
        let plugin = (self.loader)(Box::new(portal));
        self.plugin = Some(plugin);
    }

    pub fn is_enabled(&self) -> bool {
        self.plugin.is_some()
    }

    pub fn plugin(&self) -> &dyn Plugin {
        self.plugin
            .as_ref()
            .expect("Tried to access a plugin that is not enabled!")
            .as_ref()
    }
}

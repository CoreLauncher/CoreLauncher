use std::sync::Arc;

use corelauncher_types::{Plugin, PluginEvent, PluginEventCallback};

use crate::plugins::portal::PluginPortalImpl;

pub struct PluginContainer {
    #[allow(dead_code)]
    portal: Arc<PluginPortalImpl>,
    plugin: Box<dyn Plugin>,
}

impl PluginContainer {
    pub fn new(mut plugin: Box<dyn Plugin>, callback: Arc<PluginEventCallback>) -> Self {
        let portal = Arc::new(PluginPortalImpl::new(Arc::clone(&callback)));

        plugin.on_load(&*portal);

        callback(PluginEvent::PluginLoaded(plugin.id()));

        Self { plugin, portal }
    }

    pub fn plugin(&self) -> &dyn Plugin {
        &*self.plugin
    }

    #[allow(dead_code)]
    pub fn plugin_mut(&mut self) -> &mut dyn Plugin {
        &mut *self.plugin
    }
}

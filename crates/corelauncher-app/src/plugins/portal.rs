use std::sync::Arc;

use corelauncher_types::{PluginEvent, PluginEventCallback, PluginPortal};

pub struct PluginPortalImpl {
    callback: Arc<PluginEventCallback>,
}

impl PluginPortalImpl {
    pub fn new(callback: Arc<PluginEventCallback>) -> Self {
        Self { callback }
    }
}

impl PluginPortal for PluginPortalImpl {
    fn emit(&self, event: PluginEvent) {
        (self.callback)(event);
    }
}

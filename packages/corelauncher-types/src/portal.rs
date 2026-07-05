use crate::event::PluginEvent;

pub trait PluginPortal: Send + Sync {
    fn emit(&self, event: PluginEvent);
}

use std::any::Any;

pub trait PluginPortal {
    fn emit(&self, event: PluginEvent);
}

pub trait Plugin: Send + Sync {
    fn id(&self) -> String;
    fn name(&self) -> String;
    fn version(&self) -> String;
    fn description(&self) -> String;

    fn on_load(&mut self, _portal: &dyn PluginPortal) {}
    fn on_unload(&mut self) {}

    fn as_any(&self) -> &dyn Any;
    fn as_any_mut(&mut self) -> &mut dyn Any;
}

#[derive(Debug, Clone)]
pub enum PluginEvent {
    PluginLoaded(String),
    PluginUnloaded(String),
}

pub type PluginEventCallback = Box<dyn Fn(PluginEvent) + Send + Sync>;

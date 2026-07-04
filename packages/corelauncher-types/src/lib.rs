use std::any::Any;

pub trait PluginPortal: Send + Sync {
    fn emit(&self, event: PluginEvent);
}

pub trait Plugin: Send + Sync {
    fn get_id(&self) -> String;
    fn get_name(&self) -> String;
    fn get_version(&self) -> String;
    fn get_description(&self) -> String;

    // Called when another plugin is loaded.
    fn on_plugin_load(&mut self) {}
    // Called when another plugin is unloaded.
    fn on_plugin_unload(&mut self) {}

    fn as_any(&self) -> &dyn Any;
    fn as_any_mut(&mut self) -> &mut dyn Any;
}

#[derive(Debug, Clone)]
pub enum PluginEvent {
    PluginLoaded(String),
    PluginUnloaded(String),
}

pub type PluginLoader = Box<dyn Fn(Box<dyn PluginPortal>) -> Box<dyn Plugin> + Send + Sync>;
pub type PluginEventCallback = Box<dyn Fn(PluginEvent) + Send + Sync>;

use std::any::Any;

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

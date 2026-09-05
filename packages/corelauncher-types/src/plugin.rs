use std::any::Any;

pub trait Plugin: Send + Sync {
    fn get_id(&self) -> String;
    fn get_name(&self) -> String;
    fn get_version(&self) -> String;
    fn get_description(&self) -> String;

    fn get_account_providers(&self) -> Vec<&dyn crate::AccountProvider>;
    fn get_account_instances(&self) -> Vec<&dyn crate::AccountInstance>;

    /// Called when another plugin is loaded.
    fn on_plugin_load(&mut self) {}
    /// Called when another plugin is unloaded.
    fn on_plugin_unload(&mut self) {}

    /// Called when corelauncher is launched via corelauncher:// protocol.
    fn on_protocol_launched(&mut self, _protocol: &str) {}

    fn as_any(&self) -> &dyn Any;
    fn as_any_mut(&mut self) -> &mut dyn Any;
}

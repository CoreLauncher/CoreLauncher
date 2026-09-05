use std::path::PathBuf;

use crate::event::PluginEvent;

pub trait PluginPortal: Send + Sync {
    fn emit(&self, event: PluginEvent);
    fn get_data_directory(&self, plugin_id: String) -> PathBuf;
}

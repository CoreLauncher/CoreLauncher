use std::path::PathBuf;

use crate::event::PluginEvent;

pub trait PluginPortal: Send + Sync {
    fn emit(&self, event: PluginEvent);

    /// Returns the data directory for the given plugin id. This is a directory that is unique to the plugin and can be used to store data.
    fn get_data_directory(&self, plugin_id: String) -> PathBuf;

    /// Focuses the main window of the application. This is useful for plugins that want to bring the application to the foreground.
    fn focus_main_window(&self);
}

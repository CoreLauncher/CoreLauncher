#[derive(Debug, Clone)]
pub enum PluginEvent {
    PluginLoaded(String),
    PluginUnloaded(String),
    AccountProvidersUpdated,
}

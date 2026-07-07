use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(tag = "type", content = "payload")]
#[serde(rename_all = "snake_case")]
pub enum PluginEvent {
    PluginLoaded(String),
    PluginUnloaded(String),
    AccountProvidersUpdated(Vec<Box<dyn crate::AccountProvider + Send + 'static>>),
}

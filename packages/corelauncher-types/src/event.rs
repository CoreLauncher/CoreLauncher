use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type", content = "payload")]
#[serde(rename_all = "snake_case")]
pub enum PluginEvent {
    PluginLoaded(String),
    PluginUnloaded(String),
    AccountProvidersUpdated,
}

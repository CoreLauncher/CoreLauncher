use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(tag = "type", content = "payload", rename_all = "snake_case")]
pub enum PluginEvent {
    AccountProvidersUpdated,
}

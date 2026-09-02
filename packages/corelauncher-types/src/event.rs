use serde::Serialize;

use crate::accounts::account_provider::AccountProviderInfo;

#[derive(Debug, Serialize)]
#[serde(tag = "type", content = "payload", rename_all = "snake_case")]
pub enum PluginEvent {
    PluginLoaded(String),
    PluginUnloaded(String),
    AccountProvidersUpdated(Vec<AccountProviderInfo>),
}

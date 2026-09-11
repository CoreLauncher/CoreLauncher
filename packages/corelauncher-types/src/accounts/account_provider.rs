use serde::Serialize;

pub trait AccountProvider: std::fmt::Debug + Send + Sync {
    /// Global unique id for the provider
    fn id(&self) -> String;
    /// The plugin that this provider belongs to
    fn plugin_id(&self) -> String;

    /// Human readable name for the provider
    fn name(&self) -> String;
    /// Optional human readable description for the provider
    fn description(&self) -> Option<String>;
    /// Hex encoded color for the provider, used in the UI
    fn color(&self) -> String;
    /// Base64 encoded icon for the provider, used in the UI
    fn icon(&self) -> String;

    fn into_info(&self) -> AccountProviderInfo {
        AccountProviderInfo {
            id: self.id(),
            plugin_id: self.plugin_id(),

            name: self.name(),
            description: self.description(),
            color: self.color(),
            icon: self.icon(),
        }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AccountProviderInfo {
    pub id: String,
    pub plugin_id: String,

    pub name: String,
    pub description: Option<String>,
    pub color: String,
    pub icon: String,
}

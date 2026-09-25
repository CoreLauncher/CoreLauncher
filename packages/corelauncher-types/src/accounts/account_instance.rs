use serde::Serialize;

pub trait AccountInstance: std::fmt::Debug + Send + Sync {
    /// Global unique id for the instance
    fn id(&self) -> String;
    /// The plugin that this instance belongs to
    fn plugin_id(&self) -> String;
    /// The account provider this instance belongs to
    fn provider_id(&self) -> String;

    /// The name of the account
    fn name(&self) -> String;
    /// Base64 encoded icon for the provider, used in the UI
    fn avatar(&self) -> Option<String>;

    fn into_info(&self) -> AccountInstanceInfo {
        AccountInstanceInfo {
            id: self.id(),
            plugin_id: self.plugin_id(),
            provider_id: self.provider_id(),

            name: self.name(),
            avatar: self.avatar(),
        }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AccountInstanceInfo {
    pub id: String,
    pub plugin_id: String,
    pub provider_id: String,

    pub name: String,
    pub avatar: Option<String>,
}

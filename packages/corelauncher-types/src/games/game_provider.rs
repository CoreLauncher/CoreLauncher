use serde::Serialize;

pub trait GameProvider: std::fmt::Debug + Send + Sync {
    /// Global unique id for the instance
    fn id(&self) -> String;
    /// The plugin that this profile belongs to
    fn plugin_id(&self) -> String;

    /// Human readable name for the instance
    fn name(&self) -> String;

    fn into_info(&self) -> GameProviderInfo {
        GameProviderInfo {
            id: self.id(),
            plugin_id: self.plugin_id(),

            name: self.name(),
        }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GameProviderInfo {
    pub id: String,
    pub plugin_id: String,

    pub name: String,
}

use serde::Serialize;

pub trait GameInstance: std::fmt::Debug + Send + Sync {
    /// Global unique id for the instance
    fn id(&self) -> String;
    /// The plugin that this profile belongs to
    fn plugin_id(&self) -> String;

    /// Human readable name for the instance
    fn name(&self) -> String;

    /// Icon image of the game
    fn icon(&self) -> Option<String>;

    /// Capsule image of the game
    fn capsule(&self) -> Option<String>;

    /// Banner image of the game
    fn banner(&self) -> Option<String>;

    fn into_info(&self) -> GameInstanceInfo {
        GameInstanceInfo {
            id: self.id(),
            plugin_id: self.plugin_id(),

            name: self.name(),
            icon: self.icon(),
            capsule: self.capsule(),
            banner: self.banner(),
        }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GameInstanceInfo {
    pub id: String,
    pub plugin_id: String,

    pub name: String,
    pub icon: Option<String>,
    pub capsule: Option<String>,
    pub banner: Option<String>,
}

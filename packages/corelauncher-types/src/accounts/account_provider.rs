use serde::{Serialize, ser::SerializeStruct};

pub trait AccountProvider: std::fmt::Debug + Send + Sync {
    /// Global unique id for the provider
    fn id(&self) -> String;
    /// Human readable name for the provider
    fn name(&self) -> String;
    /// Optional human readable description for the provider
    fn description(&self) -> Option<String>;
    /// Hex encoded color for the provider, used in the UI
    fn color(&self) -> String;
    /// Base64 encoded icon for the provider, used in the UI
    fn icon(&self) -> String;

    fn connect(&self) -> Result<(), String>;

    fn into_info(&self) -> AccountProviderInfo {
        AccountProviderInfo {
            id: self.id(),
            name: self.name(),
            description: self.description(),
            color: self.color(),
            icon: self.icon(),
        }
    }
}

impl Serialize for dyn AccountProvider {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut state = serializer.serialize_struct("AccountProvider", 3)?;
        state.serialize_field("id", &self.id())?;
        state.serialize_field("name", &self.name())?;
        state.serialize_field("description", &self.description())?;
        state.serialize_field("color", &self.color())?;
        state.serialize_field("icon", &self.icon())?;
        state.end()
    }
}

#[derive(Debug, Serialize)]
pub struct AccountProviderInfo {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub color: String,
    pub icon: String,
}

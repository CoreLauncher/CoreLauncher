use serde::{Serialize, ser::SerializeStruct};

pub trait AccountProvider: std::fmt::Debug + Send + Sync {
    fn id(&self) -> String;
}

impl Serialize for dyn AccountProvider + Send + 'static {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut state = serializer.serialize_struct("AccountProvider", 1)?;
        state.serialize_field("id", &self.id())?;
        state.end()
    }
}

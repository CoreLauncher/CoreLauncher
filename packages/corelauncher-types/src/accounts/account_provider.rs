use serde::Serialize;

pub trait AccountProvider: std::fmt::Debug + Send + Sync {
    fn id(&self) -> String;
}

impl Serialize for (dyn AccountProvider + Send + 'static) {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.id())
    }
}

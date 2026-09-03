pub trait AccountInstance: std::fmt::Debug + Send + Sync {
    /// Global unique id for the instance
    fn id(&self) -> String;

    /// Human readable name for the instance
    fn name(&self) -> String;
}

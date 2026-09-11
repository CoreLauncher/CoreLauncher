#[async_trait::async_trait]
pub trait Plugin: Send + Sync {
    fn get_id(&self) -> String;
    fn get_name(&self) -> String;
    fn get_version(&self) -> String;
    fn get_description(&self) -> String;

    fn get_account_providers(&self) -> Vec<&dyn crate::AccountProvider>;
    fn get_account_instances(&self) -> Vec<&dyn crate::AccountInstance>;

    /// Called when corelauncher is launched via corelauncher:// protocol.
    async fn on_protocol_launched(&mut self, _protocol: &str) {}

    /// Called when the user wants to connect an account for this plugin. This is called when the user clicks the "Connect" button in the settings.
    async fn on_connect_account_instance(
        &mut self,
        account_provider_id: &str,
    ) -> Result<(), String> {
        Ok(())
    }

    async fn on_disconnect_account_instance(
        &mut self,
        account_provider_id: &str,
        account_instance_id: &str,
    ) -> Result<(), String> {
        Ok(())
    }
}

use std::{
    path::PathBuf,
    sync::{Arc, mpsc},
};

use corelauncher_types::{Plugin, PluginEvent};

use crate::{IPCEvent, plugins::portal::PluginPortalImpl};

pub struct PluginManager {
    portal: Arc<Box<dyn corelauncher_types::PluginPortal>>,
    plugins: Vec<Box<dyn Plugin>>,
    pub event_receiver: Option<mpsc::Receiver<PluginEvent>>,
}

type PluginConstructor =
    dyn FnOnce(Arc<Box<dyn corelauncher_types::PluginPortal>>) -> Box<dyn Plugin>;

impl PluginManager {
    pub fn new(data_directory: PathBuf) -> Self {
        let (event_sender, event_receiver) = mpsc::channel::<PluginEvent>();
        Self {
            portal: Arc::new(Box::new(PluginPortalImpl::new(
                event_sender,
                data_directory,
            ))),
            plugins: Vec::new(),
            event_receiver: Some(event_receiver),
        }
    }

    pub fn register_plugin(&mut self, plugin_constructor: Box<PluginConstructor>) {
        self.plugins.push(plugin_constructor(self.portal.clone()));
    }

    #[allow(dead_code)]
    pub fn plugins(&self) -> Vec<&dyn Plugin> {
        self.plugins.iter().map(|c| c.as_ref()).collect()
    }

    #[allow(dead_code)]
    pub fn get_plugin(&self, id: &str) -> Option<&dyn Plugin> {
        self.plugins
            .iter()
            .find(|p| p.get_id() == id)
            .map(|p| p.as_ref())
    }

    /// Returns all account providers from all plugins.
    pub fn get_account_providers(&self) -> Vec<&dyn corelauncher_types::AccountProvider> {
        self.plugins
            .iter()
            .flat_map(|p| p.get_account_providers())
            .collect()
    }

    /// Returns all account instances from all plugins.
    pub fn get_account_instances(&self) -> Vec<&dyn corelauncher_types::AccountInstance> {
        self.plugins
            .iter()
            .flat_map(|p| p.get_account_instances())
            .collect()
    }

    /// Notifies all plugins that corelauncher was launched via protocol.
    pub async fn emit_protocol_launched(&mut self, protocol: &str) {
        for plugin in &mut self.plugins {
            plugin.on_protocol_launched(protocol).await;
        }
    }

    /// Triggers account connection for the plugin that owns the given provider id.
    pub async fn emit_connect_account_instance(
        &mut self,
        plugin_id: &str,
        account_provider_id: &str,
    ) -> Result<(), String> {
        self.plugins
            .iter_mut()
            .find(|p| p.get_id() == plugin_id)
            .ok_or_else(|| String::from("Plugin not found"))?
            .on_connect_account_instance(account_provider_id)
            .await
            .map(|_| ())
            .map_err(|e| format!("Failed to connect account instance: {}", e))
    }

    /// Triggers account disconnection for the plugin that owns the given provider and instance id.
    pub async fn emit_disconnect_account_instance(
        &mut self,
        plugin_id: &str,
        account_provider_id: &str,
        account_instance_id: &str,
    ) -> Result<(), String> {
        self.plugins
            .iter_mut()
            .find(|p| p.get_id() == plugin_id)
            .ok_or_else(|| String::from("Plugin not found"))?
            .on_disconnect_account_instance(account_provider_id, account_instance_id)
            .await
            .map(|_| ())
            .map_err(|e| format!("Failed to disconnect account instance: {}", e))
    }

    /// Returns events required to sync the frontend with the current state.
    pub fn setup_events(&mut self) -> Vec<IPCEvent> {
        let mut events = Vec::new();

        events.push(IPCEvent::AccountProvidersUpdated(
            self.get_account_providers()
                .iter()
                .map(|p| p.into_info())
                .collect(),
        ));

        events.push(IPCEvent::AccountInstancesUpdated(
            self.get_account_instances()
                .iter()
                .map(|p| p.into_info())
                .collect(),
        ));

        return events;
    }
}

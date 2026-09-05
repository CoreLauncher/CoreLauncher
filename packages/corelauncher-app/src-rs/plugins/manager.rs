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

    /// Returns the account provider with the given id, or None if not found.
    pub fn get_account_provider(
        &self,
        id: String,
    ) -> Option<&dyn corelauncher_types::AccountProvider> {
        for plugin in &self.plugins {
            for provider in plugin.get_account_providers() {
                if provider.id() == id {
                    return Some(provider);
                }
            }
        }
        None
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

        return events;
    }
}

use std::sync::{Arc, mpsc};

use corelauncher_types::{Plugin, PluginEvent};

use crate::plugins::portal::PluginPortalImpl;

pub struct PluginManager {
    portal: Arc<Box<dyn corelauncher_types::PluginPortal>>,
    plugins: Vec<Box<dyn Plugin>>,
    pub event_receiver: Option<mpsc::Receiver<PluginEvent>>,
}

type PluginConstructor =
    dyn FnOnce(Arc<Box<dyn corelauncher_types::PluginPortal>>) -> Box<dyn Plugin>;

impl PluginManager {
    pub fn new() -> Self {
        let (event_sender, event_receiver) = mpsc::channel::<PluginEvent>();
        Self {
            portal: Arc::new(Box::new(PluginPortalImpl::new(event_sender))),
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

    pub fn get_account_providers(
        &self,
    ) -> Vec<Box<dyn corelauncher_types::AccountProvider + Send + 'static>> {
        self.plugins
            .iter()
            .flat_map(|p| p.get_account_providers())
            .collect()
    }

    pub fn setup_events(&mut self) -> Vec<PluginEvent> {
        let mut events = Vec::new();

        events.push(PluginEvent::AccountProvidersUpdated(
            self.get_account_providers(),
        ));

        return events;
    }
}

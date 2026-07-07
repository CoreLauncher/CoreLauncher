use std::{any::Any, sync::Arc};

use corelauncher_types::{AccountProvider, Plugin, PluginPortal};

#[allow(dead_code)]
pub struct PluginSteam {
    portal: Arc<Box<dyn PluginPortal>>,
    account_provider: SteamAccountProvider,
}

impl PluginSteam {
    pub fn new(portal: Arc<Box<dyn PluginPortal>>) -> Self {
        let account_provider = SteamAccountProvider::new();
        portal.emit(corelauncher_types::PluginEvent::AccountProvidersUpdated(
            vec![Box::new(account_provider.clone())],
        ));

        Self {
            portal,
            account_provider,
        }
    }
}

impl Plugin for PluginSteam {
    fn get_id(&self) -> String {
        "corelauncher-plugin-steam".into()
    }

    fn get_name(&self) -> String {
        "Steam".into()
    }

    fn get_version(&self) -> String {
        "0.1.0".into()
    }

    fn get_description(&self) -> String {
        "A plugin to integrate Steam games into CoreLauncher.".into()
    }

    fn get_account_providers(
        &self,
    ) -> Vec<Box<dyn corelauncher_types::AccountProvider + Send + 'static>> {
        vec![Box::new(self.account_provider.clone())]
    }

    fn as_any(&self) -> &dyn Any {
        self
    }

    fn as_any_mut(&mut self) -> &mut dyn Any {
        self
    }
}

#[derive(Debug, Clone)]
struct SteamAccountProvider;

impl SteamAccountProvider {
    pub fn new() -> Self {
        Self {}
    }
}

impl AccountProvider for SteamAccountProvider {
    fn id(&self) -> String {
        "steam".into()
    }
}

use std::{any::Any, sync::Arc};

use corelauncher_types::{AccountProvider, Plugin, PluginPortal};
use rust_embed::Embed;
use rust_embed_addon::RustEmbedAddon;

#[derive(Embed)]
#[folder = "assets"]
struct Assets;

#[allow(dead_code)]
pub struct PluginSteam {
    portal: Arc<Box<dyn PluginPortal>>,
    account_provider: SteamAccountProvider,
}

impl PluginSteam {
    pub fn new(portal: Arc<Box<dyn PluginPortal>>) -> Self {
        let account_provider = SteamAccountProvider::new();
        portal.emit(corelauncher_types::PluginEvent::AccountProvidersUpdated(
            vec![account_provider.into_info()],
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
        "1.0.0".into()
    }

    fn get_description(&self) -> String {
        "A plugin to integrate Steam games into CoreLauncher.".into()
    }

    fn get_account_providers(&self) -> Vec<&dyn corelauncher_types::AccountProvider> {
        vec![&self.account_provider]
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

    fn name(&self) -> String {
        "Steam".into()
    }

    fn description(&self) -> Option<String> {
        None
    }

    fn color(&self) -> String {
        "#1a9fff".into()
    }

    fn icon(&self) -> String {
        Assets::get_base64_resource("steam.svg").expect("Missing steam plugin icon")
    }

    fn connect(&self) -> Result<(), String> {
        todo!()
    }
}

use std::{any::Any, sync::Arc};

use corelauncher_types::{AccountProvider, Plugin, PluginPortal};
use rust_embed::Embed;
use rust_embed_addon::RustEmbedAddon;

#[derive(Embed)]
#[folder = "assets"]
struct Assets;

pub struct PluginMinecraft {
    portal: Arc<Box<dyn PluginPortal>>,
    account_provider: MinecraftAccountProvider,
}

impl PluginMinecraft {
    pub fn new(portal: Arc<Box<dyn PluginPortal>>) -> Self {
        let account_provider = MinecraftAccountProvider::new();
        portal.emit(corelauncher_types::PluginEvent::AccountProvidersUpdated(
            vec![account_provider.into_info()],
        ));

        Self {
            portal,
            account_provider,
        }
    }
}

impl Plugin for PluginMinecraft {
    fn get_id(&self) -> String {
        "corelauncher-plugin-minecraft".into()
    }

    fn get_name(&self) -> String {
        "Minecraft".into()
    }

    fn get_version(&self) -> String {
        "1.0.0".into()
    }

    fn get_description(&self) -> String {
        "A plugin to integrate Minecraft into CoreLauncher.".into()
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
struct MinecraftAccountProvider;

impl MinecraftAccountProvider {
    pub fn new() -> Self {
        Self {}
    }
}

impl AccountProvider for MinecraftAccountProvider {
    fn id(&self) -> String {
        "minecraft".into()
    }

    fn name(&self) -> String {
        "Minecraft".into()
    }

    fn description(&self) -> Option<String> {
        None
    }

    fn color(&self) -> String {
        "#52a535".into()
    }

    fn icon(&self) -> String {
        Assets::get_base64_resource("account-icon.svg").expect("Missing minecraft plugin icon")
    }

    fn connect(&self) -> Result<(), String> {
        webbrowser::open("https://example.com").expect("Failed to open web browser");
        Ok(())
    }
}

use std::any::Any;

use corelauncher_types::{Plugin, PluginPortal};

pub struct PluginSteam {
    initialized: bool,
}

impl PluginSteam {
    pub fn new() -> Self {
        Self { initialized: false }
    }
}

impl Default for PluginSteam {
    fn default() -> Self {
        Self::new()
    }
}

impl Plugin for PluginSteam {
    fn id(&self) -> String {
        "corelauncher-plugin-steam".into()
    }

    fn name(&self) -> String {
        "Steam".into()
    }

    fn version(&self) -> String {
        "0.1.0".into()
    }

    fn description(&self) -> String {
        "A plugin to integrate Steam games into CoreLauncher.".into()
    }

    fn on_load(&mut self, _portal: &dyn PluginPortal) {
        self.initialized = true;
        println!("Steam plugin loaded");
    }

    fn on_unload(&mut self) {
        self.initialized = false;
        println!("Steam plugin unloaded");
    }

    fn as_any(&self) -> &dyn Any {
        self
    }

    fn as_any_mut(&mut self) -> &mut dyn Any {
        self
    }
}

use std::any::Any;

use corelauncher_types::{Plugin, PluginPortal};

pub struct PluginSteam {
    _portal: Box<dyn PluginPortal>,
}

impl PluginSteam {
    pub fn new(portal: Box<dyn PluginPortal>) -> Self {
        Self { _portal: portal }
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

    fn as_any(&self) -> &dyn Any {
        self
    }

    fn as_any_mut(&mut self) -> &mut dyn Any {
        self
    }
}

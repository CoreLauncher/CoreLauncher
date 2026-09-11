use std::{env::current_exe, path::PathBuf};

pub struct Constants;

impl Constants {
    pub fn _app_id() -> String {
        "corelauncher".to_string()
    }

    #[allow(dead_code)]
    pub fn app_name() -> String {
        "CoreLauncher".to_string()
    }

    #[allow(dead_code)]
    pub fn app_version() -> String {
        env!("CARGO_PKG_VERSION").to_string()
    }

    pub fn app_directory() -> PathBuf {
        let exe_path = current_exe().expect("Failed to get current executable");
        let parent = exe_path.parent().expect("Failed to get parent");
        let is_in_target = parent.ends_with("target/debug") || parent.ends_with("target/release");

        if is_in_target {
            return parent.join("../../.corelauncher");
        } else {
            panic!("CoreLauncher can only be run under the rust target directory at this time.")
        }
    }
}

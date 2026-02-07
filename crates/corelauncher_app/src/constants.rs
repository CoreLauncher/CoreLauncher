use std::{env::current_exe, fs};

pub struct Constants;

impl Constants {
    pub fn _app_id() -> String {
        "corelauncher".to_string()
    }

    pub fn app_name() -> String {
        "CoreLauncher".to_string()
    }

    pub fn _app_version() -> String {
        env!("CARGO_PKG_VERSION").to_string()
    }

    pub fn app_directory() -> String {
        let exe_path = current_exe().unwrap();
        let joined_dir = exe_path.parent().unwrap().join("../../.corelauncher/");
        let app_dir = fs::canonicalize(joined_dir).unwrap();
        app_dir.to_str().unwrap().to_string()
    }
}

use std::{env, fs, path::PathBuf};

fn main() {
    let profile = env::var("PROFILE").unwrap();

    if profile == "release" {
        let out_dir = env::var("OUT_DIR").unwrap();
        let target_dll = PathBuf::from(&out_dir)
            .ancestors()
            .nth(3)
            .unwrap()
            .join("tray.dll");

        let dest_dir = PathBuf::from("./");

        fs::create_dir_all(&dest_dir).unwrap();

        fs::copy(&target_dll, dest_dir.join("tray.dll")).unwrap();

        println!("cargo:warning=Copied DLL to {:?}", dest_dir);
    }
}

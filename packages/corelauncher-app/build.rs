#[cfg(not(debug_assertions))]
fn build_frontend() {
    let out_dir = std::env::var("OUT_DIR").unwrap();

    let arguments = [
        "build",
        "--target=browser",
        "--outdir",
        out_dir.as_str(),
        "./src-ts/index.html",
    ];

    println!("bun {}", arguments.join(" "));

    let output = std::process::Command::new("bun")
        .args(arguments)
        .current_dir("../../packages/corelauncher-app/")
        .output()
        .expect("Failed to bundle html with bun");

    if !output.status.success() {
        eprintln!("bun failed with status: {}", output.status);
        eprintln!("stdout: {}", String::from_utf8_lossy(&output.stdout));
        eprintln!("stderr: {}", String::from_utf8_lossy(&output.stderr));
        panic!("Failed to bundle html with bun");
    }
}

#[cfg(windows)]
fn set_icon() {
    let mut res = winresource::WindowsResource::new();
    res.set_icon("../../assets/logos/logo.ico");
    res.compile().unwrap();
}

fn main() {
    println!("cargo:rerun-if-changed=packages/corelauncher-app/public/");
    println!("cargo:rerun-if-changed=build.rs");

    #[cfg(not(debug_assertions))]
    build_frontend();

    #[cfg(windows)]
    set_icon();
}

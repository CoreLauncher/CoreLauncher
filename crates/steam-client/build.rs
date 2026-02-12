use serde::{Deserialize, Serialize};
use std::{env, fs, path::PathBuf};

#[derive(Serialize, Deserialize, Debug)]
struct GithubFile {
    name: String,
    path: String,
    download_url: String,
}

fn fetch_directory(
    client: &reqwest::blocking::Client,
    owner: &str,
    repo: &str,
    commit: &str,
    directory: &str,
) -> Vec<GithubFile> {
    let contents_url = format!(
        "https://api.github.com/repos/{}/{}/contents/{}?ref={}",
        owner, repo, directory, commit
    );

    let response = client.get(contents_url).send().unwrap();
    let files = response.json().unwrap();
    return files;
}

fn download_file(client: &reqwest::blocking::Client, destination: &PathBuf, file: &GithubFile) {
    let response = client.get(&file.download_url).send();
    let content = response.unwrap().bytes().unwrap();
    if let Some(parent) = destination.parent() {
        fs::create_dir_all(parent).unwrap();
    }
    fs::write(destination, content).unwrap();
}

fn download_protos(out_dir: &PathBuf, client: &reqwest::blocking::Client) -> Vec<PathBuf> {
    let owner = "SteamDatabase";
    let repo = "Protobufs";
    let commit = "f98bd7fe1d3c2f4fab269e5b31a37638bcf99760";
    let directories = ["steam", "google/protobuf", "webui"];
    let protos_dir = out_dir.join("protos");
    let mut protos: Vec<PathBuf> = Vec::new();

    for directory in directories {
        let files = fetch_directory(client, owner, repo, commit, directory);
        for file in files {
            let path = protos_dir.join(&file.path);
            download_file(&client, &path, &file);
            if file.path.starts_with("steam") {
                protos.push(path);
            }
        }
    }

    return protos;
}

fn download_protoc(out_dir: &PathBuf) {
    let protoc_path = protoc_fetcher::protoc("31.1", out_dir).unwrap();
    println!("{:?}", protoc_path);
    unsafe { env::set_var("PROTOC", &protoc_path) };
}

fn main() {
    println!("cargo::rerun-if-changed=build.rs");

    let out_dir = env::var("OUT_DIR").map(|path| PathBuf::from(path)).unwrap();
    let client = reqwest::blocking::Client::builder()
        .user_agent("CoreLauncher")
        .build()
        .unwrap();

    download_protoc(&out_dir);
    let protos = download_protos(&out_dir, &client);

    let result = prost_build::compile_protos(
        protos.as_slice(),
        &[
            out_dir.join("protos/steam"),
            out_dir.join("protos/google/protobuf"),
            out_dir.join("protos/webui"),
        ],
    );

    match result {
        Ok(_) => {
            println!("Successfully compiled protos.");
        }
        Err(e) => {
            panic!("Failed to compile protos: {}", e);
        }
    }
}

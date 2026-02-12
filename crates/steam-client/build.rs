// use protobuf_codegen::CodeGen;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::{env, fs, path::PathBuf};

#[derive(Serialize, Deserialize, Debug)]
struct GithubFile {
    name: String,
    path: String,
    download_url: String,
}

async fn fetch_directory(
    client: Client,
    owner: &str,
    repo: &str,
    commit: &str,
    directory: &str,
) -> Vec<GithubFile> {
    let contents_url = format!(
        "https://api.github.com/repos/{}/{}/contents/{}?ref={}",
        owner, repo, directory, commit
    );

    let response = client.get(contents_url).send().await;
    let text = response.unwrap().text().await.unwrap();
    println!("{:?}", text);
    let files: Vec<GithubFile> = serde_json::from_str(&text).unwrap();
    println!("{:?}", files);
    return files;
}

async fn download_file(client: Client, file: &GithubFile) {
    let response = client.get(&file.download_url).send().await;
    let content = response.unwrap().bytes().await.unwrap();
    let path = PathBuf::from(format!("protobuf/{}", file.path));
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).unwrap();
    }
    fs::write(path, content).unwrap();
}

async fn download_protos() {
    let owner = "SteamDatabase";
    let repo = "Protobufs";
    let commit = "f98bd7fe1d3c2f4fab269e5b31a37638bcf99760";
    let directories = ["steam", "google/protobuf", "webui"];

    let client = reqwest::Client::builder()
        .user_agent("CoreLauncher")
        .build()
        .unwrap();

    for directory in directories {
        let files = fetch_directory(client.clone(), owner, repo, commit, directory).await;

        for file in files {
            download_file(client.clone(), &file).await;
        }
    }
}

#[tokio::main]
async fn main() {
    let cwd = env::current_dir().unwrap();
    let _ = fs::create_dir(cwd.join("protobuf"));

    download_protos().await;

    // CodeGen::new()
    //     .include("protobuf")
    //     .dependency(protobuf_well_known_types::get_dependency(
    //         "protobuf_well_known_types",
    //     ))
    //     .generate_and_compile()
    //     .unwrap();

    panic!("Logs")
}

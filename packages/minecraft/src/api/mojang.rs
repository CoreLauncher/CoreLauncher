use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct XboxLoginRequest {
    identity_token: String,
}

#[derive(Debug, Deserialize)]
pub struct MinecraftLoginResponse {
    pub access_token: String,
    pub expires_in: u64,
    pub token_type: String,
    pub username: String,
}

pub async fn login_with_xbox(
    http_client: &reqwest::Client,
    uhs: String,
    xsts_token: String,
) -> Result<MinecraftLoginResponse, reqwest::Error> {
    let request = XboxLoginRequest {
        identity_token: format!("XBL3.0 x={};{}", uhs, xsts_token),
    };

    let response = http_client
        .post("https://api.minecraftservices.com/authentication/login_with_xbox")
        .json(&request)
        .send()
        .await?;

    let data = response.json::<MinecraftLoginResponse>().await?;
    return Ok(data);
}

#[derive(Debug, Deserialize)]
pub struct MinecraftProfile {
    pub id: String,
    pub name: String,
}

pub async fn get_minecraft_profile(
    http_client: &reqwest::Client,
    access_token: String,
) -> Result<MinecraftProfile, reqwest::Error> {
    let response = http_client
        .get("https://api.minecraftservices.com/minecraft/profile")
        .bearer_auth(access_token)
        .send()
        .await?;

    let data = response.json::<MinecraftProfile>().await?;
    return Ok(data);
}

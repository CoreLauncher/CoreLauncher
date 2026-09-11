pub mod api;

pub struct MinecraftProfile {
    pub id: String,
    pub username: String,
    pub access_token: String,
    pub expiry_date: u64,
}

pub async fn retreive_minecraft_profile(
    http_client: &reqwest::Client,
    access_token: &String,
) -> Result<MinecraftProfile, reqwest::Error> {
    let xbox_live_token = api::xnet::exchange_rps_ticket_for_user_token(
        http_client,
        access_token.clone(),
        Some("d".into()),
    )
    .await?;

    let xbox_secure_token = api::xnet::exchange_token_for_xsts_token(
        http_client,
        xbox_live_token,
        "rp://api.minecraftservices.com/".into(),
    )
    .await?;

    let minecraft_token = api::mojang::login_with_xbox(
        http_client,
        xbox_secure_token.display_claims.xui[0].uhs.clone(),
        xbox_secure_token.token.clone(),
    )
    .await?;

    let minecraft_profile =
        api::mojang::get_minecraft_profile(http_client, minecraft_token.access_token.clone())
            .await?;

    return Ok(MinecraftProfile {
        id: minecraft_profile.id,
        username: minecraft_profile.name,
        access_token: minecraft_token.access_token,
        expiry_date: minecraft_token.expires_in,
    });
}

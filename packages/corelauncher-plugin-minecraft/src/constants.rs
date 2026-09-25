pub const MSA_CLIENT_ID: &str = "54e48db0-6129-4320-82a7-3b0156811a91";
pub const MSA_SCOPE: &[&str] = &["XboxLive.signin", "XboxLive.offline_access"];

#[cfg(not(debug_assertions))]
pub const MSA_REDIRECT_URI: &str = "corelauncher://plugin/minecraft/login_callback";
#[cfg(debug_assertions)]
pub const MSA_REDIRECT_URI: &str = "corelauncher-development://plugin/minecraft/login_callback";

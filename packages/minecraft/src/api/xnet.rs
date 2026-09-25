use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
#[serde(rename_all = "PascalCase")]
struct XNetRequest<P> {
    properties: P,
    relying_party: String,
    token_type: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "PascalCase")]
struct RPSTicketProperties {
    auth_method: String,
    site_name: String,
    rps_ticket: String,
}

#[derive(Debug, Deserialize)]
pub struct DisplayClaims {
    pub xui: Vec<Xui>,
}

#[derive(Debug, Deserialize)]
pub struct Xui {
    pub xid: Option<String>,
    pub uhs: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "PascalCase")]
// Also has other properties but they are not implemented because they are not needed.
pub struct XNetAuthResponse {
    pub issue_instant: String,
    pub not_after: String,
    pub token: String,
    pub display_claims: DisplayClaims,
}

pub async fn exchange_rps_ticket_for_user_token(
    http_client: &reqwest::Client,
    rps_ticket: String,
    preamble: Option<String>,
) -> Result<String, reqwest::Error> {
    let preamble = preamble.unwrap_or("t".into());
    let rps_ticket = format!("{}={}", preamble, rps_ticket);

    let request: XNetRequest<RPSTicketProperties> = XNetRequest {
        relying_party: "http://auth.xboxlive.com".into(),
        token_type: "JWT".into(),
        properties: RPSTicketProperties {
            auth_method: "RPS".into(),
            site_name: "user.auth.xboxlive.com".into(),
            rps_ticket,
        },
    };

    let response = http_client
        .post("https://user.auth.xboxlive.com/user/authenticate")
        .json(&request)
        .send()
        .await?;

    let data = response.json::<XNetAuthResponse>().await?;

    return Ok(data.token);
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "PascalCase")]
struct XNETXSTSAuthorizeProperties {
    user_tokens: Vec<String>,
    sandbox_id: String,
}

pub async fn exchange_token_for_xsts_token(
    http_client: &reqwest::Client,
    token: String,
    relying_party: String,
) -> Result<XNetAuthResponse, reqwest::Error> {
    let request: XNetRequest<XNETXSTSAuthorizeProperties> = XNetRequest {
        relying_party: relying_party,
        token_type: "JWT".into(),
        properties: XNETXSTSAuthorizeProperties {
            user_tokens: vec![token],
            sandbox_id: "RETAIL".into(),
        },
    };

    let response = http_client
        .post("https://xsts.auth.xboxlive.com/xsts/authorize")
        .json(&request)
        .send()
        .await?;

    let data = response.json::<XNetAuthResponse>().await?;
    return Ok(data);
}

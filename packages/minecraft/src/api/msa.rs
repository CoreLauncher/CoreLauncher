use reqwest::header::{ACCEPT, CONTENT_TYPE};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
struct AuthorizeUrlQuery {
    client_id: String,
    scope: String,
    redirect_uri: String,
    response_type: String,
    prompt: Option<String>,
}

pub fn get_authorize_url(client_id: String, scope: &[&str], redirect_uri: String) -> String {
    let query = AuthorizeUrlQuery {
        client_id,
        scope: scope.join(" "),
        redirect_uri,
        response_type: "code".into(),
        prompt: Some("select_account".into()),
    };

    let query_string = serde_qs::to_string(&query).unwrap();
    format!(
        "https://login.live.com/oauth20_authorize.srf?{}",
        query_string
    )
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum AuthorizeResponseUrlQuery {
    Code {
        code: String,
    },
    Error {
        error: String,
        error_description: String,
    },
}

#[derive(Debug)]
pub enum ExchangeCodeError {
    AuthorizeError {
        error: String,
        error_description: String,
    },
    ParseError,
    HttpError,
}

pub async fn exchange_query_for_access_token(
    http_client: &reqwest::Client,
    query: String,
    client_id: String,
    scope: &[&str],
    redirect_uri: String,
) -> Result<ExchangeCodeResponse, ExchangeCodeError> {
    let code = match serde_qs::from_str::<AuthorizeResponseUrlQuery>(query.as_str())
        .map_err(|_| ExchangeCodeError::ParseError)?
    {
        AuthorizeResponseUrlQuery::Code { code } => Ok(code),
        AuthorizeResponseUrlQuery::Error {
            error,
            error_description,
        } => Err(ExchangeCodeError::AuthorizeError {
            error,
            error_description,
        }),
    }?;

    return exchange_code_for_access_token(http_client, code, client_id, scope, redirect_uri).await;
}

#[derive(Debug, Serialize)]
struct ExchangeCodeRequest {
    code: String,
    client_id: String,
    grant_type: String,
    scope: String,
    redirect_uri: String,
}

#[derive(Debug, Deserialize)]
pub struct ExchangeCodeResponse {
    pub token_type: String,
    pub expires_in: u64,
    pub access_token: String,
    pub refresh_token: Option<String>,
    scope: String,
    user_id: String,
}

pub async fn exchange_code_for_access_token(
    http_client: &reqwest::Client,
    code: String,
    client_id: String,
    scope: &[&str],
    redirect_uri: String,
) -> Result<ExchangeCodeResponse, ExchangeCodeError> {
    let request = ExchangeCodeRequest {
        code,
        client_id,
        grant_type: "authorization_code".to_string(),
        scope: scope.join(" "),
        redirect_uri,
    };

    let response = http_client
        .post("https://login.live.com/oauth20_token.srf")
        .body(serde_qs::to_string(&request).expect("Failed to encode request body"))
        .header(ACCEPT, "application/json")
        .header(CONTENT_TYPE, "application/x-www-form-urlencoded")
        .send()
        .await
        .map_err(|_| ExchangeCodeError::HttpError)?;

    response
        .json::<ExchangeCodeResponse>()
        .await
        .map_err(|_| ExchangeCodeError::ParseError)
}

use serde::Serialize;

#[derive(Debug, Serialize)]
struct AuthorizeUrlQuery {
    client_id: String,
    scope: String,
    redirect_uri: String,
    response_type: String,
}

pub fn get_authorize_url(client_id: String, scope: &[&str], redirect_uri: String) -> String {
    let query = AuthorizeUrlQuery {
        client_id,
        scope: scope.join(" "),
        redirect_uri,
        response_type: "code".into(),
    };

    let query_string = serde_qs::to_string(&query).unwrap();
    format!(
        "https://login.live.com/oauth20_authorize.srf?{}",
        query_string
    )
}

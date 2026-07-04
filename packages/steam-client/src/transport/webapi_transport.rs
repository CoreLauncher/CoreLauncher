use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct SteamResponse<T> {
    response: T,
}

#[derive(Serialize, Deserialize)]
pub struct GetCMListForConnectRequest {
    pub cmtype: CMTransport,
    pub maxcount: u32,
}

#[derive(Serialize, Deserialize)]
pub struct GetCMListForConnectResponse {
    pub serverlist: Vec<CMServer>,
    pub success: bool,
    pub message: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CMServer {
    pub endpoint: String,
    pub r#type: CMTransport,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "lowercase")]
pub enum CMTransport {
    Websockets,
    Netfilter,
}

pub struct WebAPITransport {
    client: reqwest::Client,
}

impl WebAPITransport {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::new(),
        }
    }

    async fn call_service<R>(&self, service: &str, method: &str, version: u8) -> R
    where
        R: serde::de::DeserializeOwned,
    {
        self.call_service_with_params::<R, ()>(service, method, version, None)
            .await
    }

    async fn call_service_with_params<R, P>(
        &self,
        service: &str,
        method: &str,
        version: u8,
        parameters: Option<P>,
    ) -> R
    where
        R: serde::de::DeserializeOwned,
        P: serde::ser::Serialize,
    {
        let url = format!(
            "https://api.steampowered.com/{}/{}/v{}",
            service, method, version
        );
        println!("Calling URL: {}", url);

        let mut request = self.client.get(&url);

        if let Some(params) = parameters {
            request = request.query(&params);
        }

        let response = request
            .send()
            .await
            .unwrap()
            .json::<SteamResponse<R>>()
            .await
            .unwrap();

        return response.response;
    }

    pub async fn retrieve_cm_servers(&self) -> Vec<CMServer> {
        self.call_service_with_params::<GetCMListForConnectResponse, GetCMListForConnectRequest>(
            "ISteamDirectory",
            "GetCMListForConnect",
            1,
            Some(GetCMListForConnectRequest {
                cmtype: CMTransport::Websockets,
                maxcount: 10,
            }),
        )
        .await
        .serverlist
    }
}

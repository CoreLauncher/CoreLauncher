use tokio::net::TcpStream;
use tokio_tungstenite::{MaybeTlsStream, WebSocketStream, connect_async};

use super::webapi_transport::CMServer;
use super::webapi_transport::WebAPITransport;

pub struct WebsocketTransport {
    api: WebAPITransport,
    websocket: Option<WebSocketStream<MaybeTlsStream<TcpStream>>>,
    authenticated: bool,
}

impl WebsocketTransport {
    pub fn new() -> Self {
        Self {
            api: WebAPITransport::new(),
            websocket: None,
            authenticated: false,
        }
    }

    async fn find_server(&self) -> CMServer {
        let servers = self.api.retrieve_cm_servers().await;
        let server = servers.first().unwrap().clone();
        println!("{:?}", server);
        return server;
    }

    pub async fn connect(&mut self) {
        let server = self.find_server().await;
        let url = format!("wss://{}/cmsocket/", server.endpoint);
        let (websocket, ..) = connect_async(url).await.unwrap();
        self.websocket = Some(websocket);
    }

    pub async fn send_message(&mut self) {}
}

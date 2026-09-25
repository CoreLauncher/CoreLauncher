use crate::transport::websocket_transport::WebsocketTransport;

pub struct QRAuthenticationClient {
    transport: WebsocketTransport,
}

impl QRAuthenticationClient {
    pub async fn new() -> Self {
        let mut this = Self {
            transport: WebsocketTransport::new(),
        };

        this.transport.connect().await;
        return this;
    }
}

use steam_client::clients::qr_authentication_client::QRAuthenticationClient;

#[tokio::main]
async fn main() {
    println!("Hello, world!");
    let client = QRAuthenticationClient::new().await;
}

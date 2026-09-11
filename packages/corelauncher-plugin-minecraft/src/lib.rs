use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use corelauncher_types::{AccountInstance, AccountProvider, Plugin, PluginPortal};
use database::{Database, Migrations, create_database, include_migrations};
use rusqlite::params;

use minecraft::api::msa::{exchange_query_for_access_token, get_authorize_url};
use rust_embed::Embed;
use rust_embed_addon::RustEmbedAddon;

use crate::constants::{MSA_CLIENT_ID, MSA_REDIRECT_URI, MSA_SCOPE};

mod constants;

const PLUGIN_ID: &str = "corelauncher-plugin-minecraft";

static MIGRATIONS: Migrations = include_migrations!("$CARGO_MANIFEST_DIR/migrations");

#[derive(Embed)]
#[folder = "assets"]
struct Assets;

pub struct MinecraftPlugin {
    #[allow(dead_code)]
    portal: Arc<Box<dyn PluginPortal>>,

    database: Database,
    http_client: reqwest::Client,

    account_provider: MinecraftAccountProvider,
    account_instances: Vec<MinecraftAccountInstance>,
}

impl MinecraftPlugin {
    pub fn new(portal: Arc<Box<dyn PluginPortal>>) -> Self {
        let data_directory = portal.get_data_directory(PLUGIN_ID);
        std::fs::create_dir_all(&data_directory).expect("Failed to create data directory");
        let database = create_database(
            data_directory.join("database.sqlite").to_str().unwrap(),
            &MIGRATIONS,
        );

        let http_client = reqwest::Client::new();

        let account_provider = MinecraftAccountProvider::new();
        portal.emit(corelauncher_types::PluginEvent::AccountProvidersUpdated);

        let handle = tokio::runtime::Handle::current();
        let account_instances = tokio::task::block_in_place(|| {
            handle.block_on(MinecraftAccountInstance::load_all(&database))
        });

        Self {
            portal,

            database,
            http_client,

            account_provider,
            account_instances,
        }
    }
}

#[async_trait::async_trait]
impl Plugin for MinecraftPlugin {
    fn get_id(&self) -> String {
        PLUGIN_ID.into()
    }

    fn get_name(&self) -> String {
        "Minecraft".into()
    }

    fn get_version(&self) -> String {
        env!("CARGO_PKG_VERSION").into()
    }

    fn get_description(&self) -> String {
        "A plugin to integrate Minecraft into CoreLauncher.".into()
    }

    fn get_account_providers(&self) -> Vec<&dyn corelauncher_types::AccountProvider> {
        vec![&self.account_provider]
    }

    fn get_account_instances(&self) -> Vec<&dyn corelauncher_types::AccountInstance> {
        self.account_instances
            .iter()
            .map(|instance| instance as &dyn corelauncher_types::AccountInstance)
            .collect()
    }

    async fn on_protocol_launched(&mut self, url: &str) {
        let url = url::Url::parse(url).expect("Invalid URL");

        if let Some(query) = url.query()
            && url.path() == "/plugin/minecraft/login_callback"
        {
            // At this point we only log errors. We should maybe show a modal or something.
            let access_token_result = exchange_query_for_access_token(
                &self.http_client,
                query.to_string(),
                MSA_CLIENT_ID.into(),
                MSA_SCOPE,
                MSA_REDIRECT_URI.into(),
            )
            .await;

            let Ok(access_token) = access_token_result else {
                tracing::error!(
                    "Exchanging code failed: {:?}",
                    access_token_result.unwrap_err()
                );
                return;
            };

            let profile = minecraft::retreive_minecraft_profile(
                &self.http_client,
                &access_token.access_token,
            )
            .await
            .expect("Failed to retreive Minecraft profile");

            let expires_at = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs()
                + access_token.expires_in;

            if let Some(existing) = self
                .account_instances
                .iter_mut()
                .find(|i| i.id == profile.id)
            {
                existing
                    .update(
                        &self.database,
                        access_token.access_token,
                        access_token.refresh_token.unwrap_or_default(),
                        expires_at as i64,
                    )
                    .await;
            } else {
                let instance = MinecraftAccountInstance::new(
                    profile.id,
                    profile.username,
                    access_token.access_token,
                    access_token.refresh_token.unwrap_or_default(),
                    expires_at as i64,
                );
                instance.save(&self.database).await;
                self.account_instances.push(instance);
            }

            self.portal
                .emit(corelauncher_types::PluginEvent::AccountInstancesUpdated);

            self.portal.focus_main_window();
        };
    }

    async fn on_connect_account_instance(
        &mut self,
        account_provider_id: &str,
    ) -> Result<(), String> {
        let authorize_url =
            get_authorize_url(MSA_CLIENT_ID.into(), MSA_SCOPE, MSA_REDIRECT_URI.into());

        tracing::info!(
            "Opening web browser for Minecraft account connection: {}",
            authorize_url
        );

        webbrowser::open(authorize_url.as_str()).expect("Failed to open web browser");
        Ok(())
    }

    async fn on_disconnect_account_instance(
        &mut self,
        account_provider_id: &str,
        account_instance_id: &str,
    ) -> Result<(), String> {
        let raw_id = account_instance_id
            .strip_prefix("minecraft:")
            .unwrap_or(account_instance_id);

        if let Some(instance) = self.account_instances.iter().find(|i| i.id == raw_id) {
            instance.delete(&self.database).await;
        }

        self.account_instances.retain(|i| i.id != raw_id);
        self.portal
            .emit(corelauncher_types::PluginEvent::AccountInstancesUpdated);

        Ok(())
    }
}

#[derive(Debug, Clone)]
struct MinecraftAccountProvider;

impl MinecraftAccountProvider {
    pub fn new() -> Self {
        Self {}
    }
}

impl AccountProvider for MinecraftAccountProvider {
    fn id(&self) -> String {
        "minecraft".into()
    }

    fn plugin_id(&self) -> String {
        PLUGIN_ID.into()
    }

    fn name(&self) -> String {
        "Minecraft".into()
    }

    fn description(&self) -> Option<String> {
        None
    }

    fn color(&self) -> String {
        "#52a535".into()
    }

    fn icon(&self) -> String {
        Assets::get_base64_resource("account-icon.svg").expect("Missing minecraft plugin icon")
    }
}

#[derive(Debug, Clone)]
struct MinecraftAccountInstance {
    id: String,
    username: String,
    access_token: String,
    refresh_token: String,
    expires_at: i64,
}

impl MinecraftAccountInstance {
    pub fn new(
        id: String,
        username: String,
        access_token: String,
        refresh_token: String,
        expires_at: i64,
    ) -> Self {
        Self {
            id,
            username,
            access_token,
            refresh_token,
            expires_at,
        }
    }

    pub async fn load_all(database: &Database) -> Vec<Self> {
        let db = database.lock().await;
        let mut statement = db
            .prepare("SELECT id, name, access_token, refresh_token, expires_at FROM accounts")
            .unwrap();
        let rows = statement
            .query_map([], |row| {
                Ok(MinecraftAccountInstance::new(
                    row.get(0)?,
                    row.get(1)?,
                    row.get(2)?,
                    row.get(3)?,
                    row.get(4)?,
                ))
            })
            .unwrap();
        rows.filter_map(|r| r.ok()).collect()
    }

    pub async fn save(&self, database: &Database) {
        let db = database.lock().await;
        db.execute(
            "INSERT OR REPLACE INTO accounts (id, name, access_token, refresh_token, expires_at) VALUES (?1, ?2, ?3, ?4, ?5)",
            params![
                self.id,
                self.username,
                self.access_token,
                self.refresh_token,
                self.expires_at,
            ],
        )
        .expect("Failed to save account instance to database");
    }

    pub async fn delete(&self, database: &Database) {
        let db = database.lock().await;
        db.execute("DELETE FROM accounts WHERE id = ?1", params![self.id])
            .expect("Failed to delete account instance from database");
    }

    pub async fn update(
        &mut self,
        database: &Database,
        access_token: String,
        refresh_token: String,
        expires_at: i64,
    ) {
        let db = database.lock().await;
        db.execute(
            "UPDATE accounts SET access_token = ?1, refresh_token = ?2, expires_at = ?3 WHERE id = ?4",
            params![access_token, refresh_token, expires_at, self.id],
        )
        .expect("Failed to update account instance in database");

        self.access_token = access_token;
        self.refresh_token = refresh_token;
        self.expires_at = expires_at;
    }
}

impl AccountInstance for MinecraftAccountInstance {
    fn id(&self) -> String {
        format!("minecraft:{}", self.id)
    }

    fn plugin_id(&self) -> String {
        PLUGIN_ID.into()
    }

    fn provider_id(&self) -> String {
        "minecraft".into()
    }

    fn name(&self) -> String {
        self.username.clone()
    }

    fn avatar(&self) -> Option<String> {
        // Cache this image on device?
        Some(format!("https://api.mineatar.io/face/{}?scale=32", self.id))
    }
}

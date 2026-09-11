use std::sync::Arc;

pub use rusqlite::Connection;
use tokio::sync::Mutex;

pub type Migrations = include_dir::Dir<'static>;
pub type Database = Arc<Mutex<Connection>>;

pub use include_dir::include_dir as include_migrations;

pub fn create_database(path: &str, migrations: &'static Migrations) -> Database {
    let mut database = Connection::open(path).unwrap();

    // Run migrations
    let migrations = rusqlite_migration::Migrations::from_directory(migrations).unwrap();
    migrations.to_latest(&mut database).unwrap();

    // Set SQLite pragmas for performance
    database
        .execute_batch(
            r"
                PRAGMA journal_mode = WAL;
                PRAGMA synchronous=NORMAL;
                PRAGMA temp_store=MEMORY;
                PRAGMA cache_size=-65536
            ",
        )
        .unwrap();

    return Arc::new(Mutex::new(database));
}

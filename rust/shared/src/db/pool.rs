//! Database connection pool and utilities

use sqlx::{postgres::PgPoolOptions, PgPool};
use std::time::Duration;
use crate::config::DatabaseSettings;

/// Create a PostgreSQL connection pool
pub async fn create_pool(settings: &DatabaseSettings) -> Result<PgPool, sqlx::Error> {
    tracing::info!("Creating PostgreSQL connection pool...");
    tracing::debug!("Max connections: {}", settings.max_connections);
    tracing::debug!("Min connections: {}", settings.min_connections);

    PgPoolOptions::new()
        .max_connections(settings.max_connections)
        .min_connections(settings.min_connections)
        .acquire_timeout(Duration::from_secs(settings.connect_timeout_seconds))
        .connect(&settings.url)
        .await
}

/// Test database connectivity
pub async fn test_connection(pool: &PgPool) -> Result<(), sqlx::Error> {
    sqlx::query("SELECT 1")
        .execute(pool)
        .await?;
    Ok(())
}

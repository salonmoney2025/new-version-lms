//! Database module with connection pool and queries

mod pool;
pub mod students;
pub mod courses;
pub mod exams;

pub use pool::{create_pool, test_connection};

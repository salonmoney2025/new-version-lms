//! Course database queries

use sqlx::PgPool;
use uuid::Uuid;
use crate::{models::{Course, Program}, errors::{AppError, Result}};

/// Find a course by ID
pub async fn find_course_by_id(pool: &PgPool, id: Uuid) -> Result<Course> {
    tracing::debug!("Finding course by id: {}", id);

    let course = sqlx::query_as::<_, Course>(
        r#"
        SELECT
            id, code, title, campus_id, department_id, credits,
            description, prerequisites, is_active,
            created_at, updated_at
        FROM courses_course
        WHERE id = $1 AND is_active = true
        "#
    )
    .bind(id)
    .fetch_one(pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => AppError::not_found(format!("Course with id {} not found", id)),
        _ => AppError::Database(e),
    })?;

    Ok(course)
}

/// Find a course by code
pub async fn find_course_by_code(pool: &PgPool, code: &str) -> Result<Course> {
    tracing::debug!("Finding course by code: {}", code);

    let course = sqlx::query_as::<_, Course>(
        r#"
        SELECT
            id, code, title, campus_id, department_id, credits,
            description, prerequisites, is_active,
            created_at, updated_at
        FROM courses_course
        WHERE code = $1 AND is_active = true
        "#
    )
    .bind(code)
    .fetch_one(pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => AppError::not_found(format!("Course {} not found", code)),
        _ => AppError::Database(e),
    })?;

    Ok(course)
}

/// List courses with pagination
pub async fn list_courses(
    pool: &PgPool,
    offset: u32,
    limit: u32,
) -> Result<(Vec<Course>, i64)> {
    tracing::debug!("Listing courses: offset={}, limit={}", offset, limit);

    let total: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM courses_course WHERE is_active = true"
    )
    .fetch_one(pool)
    .await?;

    let courses = sqlx::query_as::<_, Course>(
        r#"
        SELECT
            id, code, title, campus_id, department_id, credits,
            description, prerequisites, is_active,
            created_at, updated_at
        FROM courses_course
        WHERE is_active = true
        ORDER BY code
        LIMIT $1 OFFSET $2
        "#
    )
    .bind(limit as i64)
    .bind(offset as i64)
    .fetch_all(pool)
    .await?;

    tracing::debug!("Found {} courses (total: {})", courses.len(), total.0);
    Ok((courses, total.0))
}

/// Find a program by ID
pub async fn find_program_by_id(pool: &PgPool, id: Uuid) -> Result<Program> {
    tracing::debug!("Finding program by id: {}", id);

    let program = sqlx::query_as::<_, Program>(
        r#"
        SELECT
            id, name, code, campus_id, department_id, degree_type,
            duration_years, total_credits, description, is_active,
            created_at, updated_at
        FROM courses_program
        WHERE id = $1 AND is_active = true
        "#
    )
    .bind(id)
    .fetch_one(pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => AppError::not_found(format!("Program with id {} not found", id)),
        _ => AppError::Database(e),
    })?;

    Ok(program)
}

/// List programs with pagination
pub async fn list_programs(
    pool: &PgPool,
    offset: u32,
    limit: u32,
) -> Result<(Vec<Program>, i64)> {
    tracing::debug!("Listing programs: offset={}, limit={}", offset, limit);

    let total: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM courses_program WHERE is_active = true"
    )
    .fetch_one(pool)
    .await?;

    let programs = sqlx::query_as::<_, Program>(
        r#"
        SELECT
            id, name, code, campus_id, department_id, degree_type,
            duration_years, total_credits, description, is_active,
            created_at, updated_at
        FROM courses_program
        WHERE is_active = true
        ORDER BY code
        LIMIT $1 OFFSET $2
        "#
    )
    .bind(limit as i64)
    .bind(offset as i64)
    .fetch_all(pool)
    .await?;

    Ok((programs, total.0))
}

//! Student database queries

use sqlx::PgPool;
use uuid::Uuid;
use crate::{models::Student, errors::{AppError, Result}};

/// Find a student by ID
pub async fn find_by_id(pool: &PgPool, id: Uuid) -> Result<Student> {
    tracing::debug!("Finding student by id: {}", id);

    let student = sqlx::query_as::<_, Student>(
        r#"
        SELECT
            id, student_id, user_id, campus_id, department_id, program_id,
            admission_date, enrollment_status, current_semester, gpa,
            guardian_name, guardian_phone, guardian_email, medical_info,
            blood_group, address, emergency_contact,
            created_at, updated_at, is_deleted
        FROM students_student
        WHERE id = $1 AND is_deleted = false
        "#
    )
    .bind(id)
    .fetch_one(pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => AppError::not_found(format!("Student with id {} not found", id)),
        _ => AppError::Database(e),
    })?;

    tracing::debug!("Found student: {}", student.student_id);
    Ok(student)
}

/// Find a student by student_id (e.g., "STU-2025-000123")
pub async fn find_by_student_id(pool: &PgPool, student_id: &str) -> Result<Student> {
    tracing::debug!("Finding student by student_id: {}", student_id);

    let student = sqlx::query_as::<_, Student>(
        r#"
        SELECT
            id, student_id, user_id, campus_id, department_id, program_id,
            admission_date, enrollment_status, current_semester, gpa,
            guardian_name, guardian_phone, guardian_email, medical_info,
            blood_group, address, emergency_contact,
            created_at, updated_at, is_deleted
        FROM students_student
        WHERE student_id = $1 AND is_deleted = false
        "#
    )
    .bind(student_id)
    .fetch_one(pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => AppError::not_found(format!("Student {} not found", student_id)),
        _ => AppError::Database(e),
    })?;

    Ok(student)
}

/// List students with pagination
pub async fn list(
    pool: &PgPool,
    offset: u32,
    limit: u32,
) -> Result<(Vec<Student>, i64)> {
    tracing::debug!("Listing students: offset={}, limit={}", offset, limit);

    // Get total count
    let total: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM students_student WHERE is_deleted = false"
    )
    .fetch_one(pool)
    .await?;

    // Get paginated students
    let students = sqlx::query_as::<_, Student>(
        r#"
        SELECT
            id, student_id, user_id, campus_id, department_id, program_id,
            admission_date, enrollment_status, current_semester, gpa,
            guardian_name, guardian_phone, guardian_email, medical_info,
            blood_group, address, emergency_contact,
            created_at, updated_at, is_deleted
        FROM students_student
        WHERE is_deleted = false
        ORDER BY admission_date DESC, student_id
        LIMIT $1 OFFSET $2
        "#
    )
    .bind(limit as i64)
    .bind(offset as i64)
    .fetch_all(pool)
    .await?;

    tracing::debug!("Found {} students (total: {})", students.len(), total.0);
    Ok((students, total.0))
}

/// List students by campus
pub async fn list_by_campus(
    pool: &PgPool,
    campus_id: Uuid,
    offset: u32,
    limit: u32,
) -> Result<(Vec<Student>, i64)> {
    tracing::debug!("Listing students by campus: {}", campus_id);

    let total: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM students_student WHERE campus_id = $1 AND is_deleted = false"
    )
    .bind(campus_id)
    .fetch_one(pool)
    .await?;

    let students = sqlx::query_as::<_, Student>(
        r#"
        SELECT
            id, student_id, user_id, campus_id, department_id, program_id,
            admission_date, enrollment_status, current_semester, gpa,
            guardian_name, guardian_phone, guardian_email, medical_info,
            blood_group, address, emergency_contact,
            created_at, updated_at, is_deleted
        FROM students_student
        WHERE campus_id = $1 AND is_deleted = false
        ORDER BY admission_date DESC, student_id
        LIMIT $2 OFFSET $3
        "#
    )
    .bind(campus_id)
    .bind(limit as i64)
    .bind(offset as i64)
    .fetch_all(pool)
    .await?;

    Ok((students, total.0))
}

/// List students by enrollment status
pub async fn list_by_status(
    pool: &PgPool,
    status: &str,
    offset: u32,
    limit: u32,
) -> Result<(Vec<Student>, i64)> {
    tracing::debug!("Listing students by status: {}", status);

    let total: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM students_student WHERE enrollment_status = $1 AND is_deleted = false"
    )
    .bind(status)
    .fetch_one(pool)
    .await?;

    let students = sqlx::query_as::<_, Student>(
        r#"
        SELECT
            id, student_id, user_id, campus_id, department_id, program_id,
            admission_date, enrollment_status, current_semester, gpa,
            guardian_name, guardian_phone, guardian_email, medical_info,
            blood_group, address, emergency_contact,
            created_at, updated_at, is_deleted
        FROM students_student
        WHERE enrollment_status = $1 AND is_deleted = false
        ORDER BY admission_date DESC, student_id
        LIMIT $2 OFFSET $3
        "#
    )
    .bind(status)
    .bind(limit as i64)
    .bind(offset as i64)
    .fetch_all(pool)
    .await?;

    Ok((students, total.0))
}

/// Count students by campus
pub async fn count_by_campus(pool: &PgPool, campus_id: Uuid) -> Result<i64> {
    let count: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM students_student WHERE campus_id = $1 AND is_deleted = false"
    )
    .bind(campus_id)
    .fetch_one(pool)
    .await?;

    Ok(count.0)
}

/// Count students by enrollment status
pub async fn count_by_status(pool: &PgPool, status: &str) -> Result<i64> {
    let count: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM students_student WHERE enrollment_status = $1 AND is_deleted = false"
    )
    .bind(status)
    .fetch_one(pool)
    .await?;

    Ok(count.0)
}

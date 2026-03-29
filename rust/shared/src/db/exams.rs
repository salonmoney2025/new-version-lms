//! Exam database queries

use sqlx::PgPool;
use uuid::Uuid;
use crate::{models::{Exam, Grade}, errors::{AppError, Result}};

/// Find an exam by ID
pub async fn find_exam_by_id(pool: &PgPool, id: Uuid) -> Result<Exam> {
    tracing::debug!("Finding exam by id: {}", id);

    let exam = sqlx::query_as::<_, Exam>(
        r#"
        SELECT
            id, course_offering_id, name, exam_type, date, start_time, end_time,
            duration_minutes, total_marks, passing_marks, instructions,
            venue, capacity, status,
            created_at, updated_at
        FROM exams_exam
        WHERE id = $1
        "#
    )
    .bind(id)
    .fetch_one(pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => AppError::not_found(format!("Exam with id {} not found", id)),
        _ => AppError::Database(e),
    })?;

    Ok(exam)
}

/// List exams with pagination
pub async fn list_exams(
    pool: &PgPool,
    offset: u32,
    limit: u32,
) -> Result<(Vec<Exam>, i64)> {
    tracing::debug!("Listing exams: offset={}, limit={}", offset, limit);

    let total: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM exams_exam"
    )
    .fetch_one(pool)
    .await?;

    let exams = sqlx::query_as::<_, Exam>(
        r#"
        SELECT
            id, course_offering_id, name, exam_type, date, start_time, end_time,
            duration_minutes, total_marks, passing_marks, instructions,
            venue, capacity, status,
            created_at, updated_at
        FROM exams_exam
        ORDER BY date DESC, start_time
        LIMIT $1 OFFSET $2
        "#
    )
    .bind(limit as i64)
    .bind(offset as i64)
    .fetch_all(pool)
    .await?;

    tracing::debug!("Found {} exams (total: {})", exams.len(), total.0);
    Ok((exams, total.0))
}

/// Find grades for a student
pub async fn find_grades_by_student(
    pool: &PgPool,
    student_id: Uuid,
) -> Result<Vec<Grade>> {
    tracing::debug!("Finding grades for student: {}", student_id);

    let grades = sqlx::query_as::<_, Grade>(
        r#"
        SELECT
            id, student_id, exam_id, marks_obtained, graded_by_id,
            graded_date, remarks, grade_letter, approval_status,
            approved_by_id, approved_date, is_published,
            published_by_id, published_date,
            created_at, updated_at
        FROM exams_grade
        WHERE student_id = $1
        ORDER BY graded_date DESC
        "#
    )
    .bind(student_id)
    .fetch_all(pool)
    .await?;

    Ok(grades)
}

/// Find grades for an exam
pub async fn find_grades_by_exam(
    pool: &PgPool,
    exam_id: Uuid,
) -> Result<Vec<Grade>> {
    tracing::debug!("Finding grades for exam: {}", exam_id);

    let grades = sqlx::query_as::<_, Grade>(
        r#"
        SELECT
            id, student_id, exam_id, marks_obtained, graded_by_id,
            graded_date, remarks, grade_letter, approval_status,
            approved_by_id, approved_date, is_published,
            published_by_id, published_date,
            created_at, updated_at
        FROM exams_grade
        WHERE exam_id = $1
        ORDER BY marks_obtained DESC
        "#
    )
    .bind(exam_id)
    .fetch_all(pool)
    .await?;

    Ok(grades)
}

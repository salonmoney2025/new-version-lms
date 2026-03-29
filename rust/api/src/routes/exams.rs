//! Exam management endpoints

use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Json},
    routing::get,
    Router,
};
use serde_json::json;
use shared::{
    db::exams,
    models::{PaginationParams, PaginatedResponse},
};
use uuid::Uuid;

use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(list_exams))
        .route("/:id", get(get_exam))
        .route("/:id/grades", get(get_exam_grades))
        .route("/students/:student_id/grades", get(get_student_grades))
}

/// GET /api/v2/exams - List all exams with pagination
async fn list_exams(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> impl IntoResponse {
    tracing::info!("Listing exams");

    let offset = params.offset();
    let limit = params.limit();

    match exams::list_exams(&state.pool, offset, limit).await {
        Ok((items, total)) => {
            let response = PaginatedResponse::new(
                items,
                total as u32,
                params.page.unwrap_or(1),
                limit,
            );
            (StatusCode::OK, Json(response)).into_response()
        }
        Err(e) => {
            tracing::error!("Failed to list exams: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Failed to fetch exams",
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

/// GET /api/v2/exams/:id - Get a specific exam
async fn get_exam(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    tracing::info!("Getting exam: {}", id);

    match exams::find_exam_by_id(&state.pool, id).await {
        Ok(exam) => (StatusCode::OK, Json(exam)).into_response(),
        Err(e) => {
            tracing::warn!("Exam not found: {}", e);
            (
                StatusCode::NOT_FOUND,
                Json(json!({
                    "error": "Exam not found",
                    "id": id,
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

/// GET /api/v2/exams/:id/grades - Get all grades for an exam
async fn get_exam_grades(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    tracing::info!("Getting grades for exam: {}", id);

    match exams::find_grades_by_exam(&state.pool, id).await {
        Ok(grades) => (StatusCode::OK, Json(grades)).into_response(),
        Err(e) => {
            tracing::error!("Failed to fetch grades: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Failed to fetch grades",
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

/// GET /api/v2/exams/students/:student_id/grades - Get all grades for a student
async fn get_student_grades(
    State(state): State<AppState>,
    Path(student_id): Path<Uuid>,
) -> impl IntoResponse {
    tracing::info!("Getting grades for student: {}", student_id);

    match exams::find_grades_by_student(&state.pool, student_id).await {
        Ok(grades) => (StatusCode::OK, Json(grades)).into_response(),
        Err(e) => {
            tracing::error!("Failed to fetch grades: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Failed to fetch grades",
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

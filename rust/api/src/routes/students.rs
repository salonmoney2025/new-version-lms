//! Student management endpoints

use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Json},
    routing::{get, post},
    Router,
};
use serde_json::json;
use shared::{
    db::students,
    models::{PaginationParams, PaginatedResponse},
};
use uuid::Uuid;

use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(list_students).post(create_student))
        .route("/:id", get(get_student))
        .route("/student-id/:student_id", get(get_student_by_student_id))
        .route("/campus/:campus_id", get(list_students_by_campus))
        .route("/status/:status", get(list_students_by_status))
}

/// GET /api/v2/students - List all students with pagination
async fn list_students(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> impl IntoResponse {
    tracing::info!("Listing students: page={:?}, page_size={:?}", params.page, params.page_size);

    let offset = params.offset();
    let limit = params.limit();

    match students::list(&state.pool, offset, limit).await {
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
            tracing::error!("Failed to list students: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Failed to fetch students",
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

/// GET /api/v2/students/:id - Get a specific student by UUID
async fn get_student(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    tracing::info!("Getting student by id: {}", id);

    match students::find_by_id(&state.pool, id).await {
        Ok(student) => (StatusCode::OK, Json(student)).into_response(),
        Err(e) => {
            tracing::warn!("Student not found: {}", e);
            (
                StatusCode::NOT_FOUND,
                Json(json!({
                    "error": "Student not found",
                    "id": id,
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

/// GET /api/v2/students/student-id/:student_id - Get student by student_id (e.g., STU-2025-000123)
async fn get_student_by_student_id(
    State(state): State<AppState>,
    Path(student_id): Path<String>,
) -> impl IntoResponse {
    tracing::info!("Getting student by student_id: {}", student_id);

    match students::find_by_student_id(&state.pool, &student_id).await {
        Ok(student) => (StatusCode::OK, Json(student)).into_response(),
        Err(e) => {
            tracing::warn!("Student not found: {}", e);
            (
                StatusCode::NOT_FOUND,
                Json(json!({
                    "error": "Student not found",
                    "student_id": student_id,
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

/// GET /api/v2/students/campus/:campus_id - List students by campus
async fn list_students_by_campus(
    State(state): State<AppState>,
    Path(campus_id): Path<Uuid>,
    Query(params): Query<PaginationParams>,
) -> impl IntoResponse {
    tracing::info!("Listing students by campus: {}", campus_id);

    let offset = params.offset();
    let limit = params.limit();

    match students::list_by_campus(&state.pool, campus_id, offset, limit).await {
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
            tracing::error!("Failed to list students by campus: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Failed to fetch students",
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

/// GET /api/v2/students/status/:status - List students by enrollment status
async fn list_students_by_status(
    State(state): State<AppState>,
    Path(status): Path<String>,
    Query(params): Query<PaginationParams>,
) -> impl IntoResponse {
    tracing::info!("Listing students by status: {}", status);

    let offset = params.offset();
    let limit = params.limit();

    match students::list_by_status(&state.pool, &status, offset, limit).await {
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
            tracing::error!("Failed to list students by status: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Failed to fetch students",
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

/// POST /api/v2/students - Create a new student
async fn create_student(
    State(state): State<AppState>,
    Json(payload): Json(serde_json::Value>,
) -> impl IntoResponse {
    tracing::info!("Creating student: {:?}", payload);

    // TODO: Implement student creation in Option C
    // For now, return 501 Not Implemented
    (
        StatusCode::NOT_IMPLEMENTED,
        Json(json!({
            "message": "Student creation will be implemented in Option C (write operations)"
        })),
    )
}

//! Course management endpoints

use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Json},
    routing::get,
    Router,
};
use serde_json::json;
use shared::{
    db::courses,
    models::{PaginationParams, PaginatedResponse},
};
use uuid::Uuid;

use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(list_courses))
        .route("/:id", get(get_course))
        .route("/code/:code", get(get_course_by_code))
        .route("/programs", get(list_programs))
        .route("/programs/:id", get(get_program))
}

/// GET /api/v2/courses - List all courses with pagination
async fn list_courses(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> impl IntoResponse {
    tracing::info!("Listing courses");

    let offset = params.offset();
    let limit = params.limit();

    match courses::list_courses(&state.pool, offset, limit).await {
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
            tracing::error!("Failed to list courses: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Failed to fetch courses",
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

/// GET /api/v2/courses/:id - Get a specific course by ID
async fn get_course(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    tracing::info!("Getting course: {}", id);

    match courses::find_course_by_id(&state.pool, id).await {
        Ok(course) => (StatusCode::OK, Json(course)).into_response(),
        Err(e) => {
            tracing::warn!("Course not found: {}", e);
            (
                StatusCode::NOT_FOUND,
                Json(json!({
                    "error": "Course not found",
                    "id": id,
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

/// GET /api/v2/courses/code/:code - Get course by code
async fn get_course_by_code(
    State(state): State<AppState>,
    Path(code): Path<String>,
) -> impl IntoResponse {
    tracing::info!("Getting course by code: {}", code);

    match courses::find_course_by_code(&state.pool, &code).await {
        Ok(course) => (StatusCode::OK, Json(course)).into_response(),
        Err(e) => {
            tracing::warn!("Course not found: {}", e);
            (
                StatusCode::NOT_FOUND,
                Json(json!({
                    "error": "Course not found",
                    "code": code,
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

/// GET /api/v2/courses/programs - List all programs
async fn list_programs(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> impl IntoResponse {
    tracing::info!("Listing programs");

    let offset = params.offset();
    let limit = params.limit();

    match courses::list_programs(&state.pool, offset, limit).await {
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
            tracing::error!("Failed to list programs: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Failed to fetch programs",
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

/// GET /api/v2/courses/programs/:id - Get a specific program
async fn get_program(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    tracing::info!("Getting program: {}", id);

    match courses::find_program_by_id(&state.pool, id).await {
        Ok(program) => (StatusCode::OK, Json(program)).into_response(),
        Err(e) => {
            tracing::warn!("Program not found: {}", e);
            (
                StatusCode::NOT_FOUND,
                Json(json!({
                    "error": "Program not found",
                    "id": id,
                    "details": e.to_string()
                })),
            )
                .into_response()
        }
    }
}

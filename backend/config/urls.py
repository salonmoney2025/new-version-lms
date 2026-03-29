"""
URL configuration for University LMS project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView
)
from core.views import api_root

# API v1 URL patterns
api_v1_patterns = [
    # Authentication
    path('auth/', include('apps.authentication.urls')),

    # Campuses
    path('campuses/', include('apps.campuses.urls')),

    # Students
    path('students/', include('apps.students.urls')),

    # Staff
    path('staff/', include('apps.staff.urls')),

    # Courses
    path('courses/', include('apps.courses.urls')),

    # Exams
    path('exams/', include('apps.exams.urls')),

    # Finance
    path('finance/', include('apps.finance.urls')),

    # Communications
    path('communications/', include('apps.communications.urls')),

    # Analytics
    path('analytics/', include('apps.analytics.urls')),

    # Letters
    path('letters/', include('apps.letters.urls')),

    # Business Center
    path('business-center/', include('apps.business_center.urls')),

    # Notifications
    path('notifications/', include('apps.notifications.urls')),
]

urlpatterns = [
    # Welcome page
    path('', api_root, name='api-root'),

    # Admin panel
    path('admin/', admin.site.urls),

    # API v1 routes
    path('api/v1/', include(api_v1_patterns)),

    # API Documentation (drf-spectacular)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    # Django Debug Toolbar
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        try:
            import debug_toolbar
            urlpatterns = [
                path('__debug__/', include(debug_toolbar.urls)),
            ] + urlpatterns
        except ImportError:
            pass

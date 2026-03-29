"""
Core App Configuration

PHASE 3: Caching Layer
Registers cache invalidation signals
"""

from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        """
        Import signals when Django starts.

        This ensures cache invalidation signals are registered
        and will automatically invalidate caches when models are updated.
        """
        try:
            import core.signals.cache_invalidation
        except ImportError:
            pass

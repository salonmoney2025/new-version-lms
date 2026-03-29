"""
Cache Helper Utilities

PHASE 3: Caching Layer
- Query-level caching decorator
- Cache key generation
- Cache invalidation helpers
"""

from django.core.cache import cache
from functools import wraps
import hashlib
import json
import logging

logger = logging.getLogger(__name__)


def cache_query(timeout=900, key_prefix='query', version=None):
    """
    Decorator for caching function results based on arguments.

    Usage:
        @cache_query(timeout=600, key_prefix='student')
        def get_student_grades(student_id, semester):
            return Grade.objects.filter(student_id=student_id, semester=semester)

    Args:
        timeout (int): Cache timeout in seconds (default: 900 = 15 minutes)
        key_prefix (str): Prefix for cache key (default: 'query')
        version (int): Cache version for invalidation (default: None)

    Returns:
        Decorated function with caching
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            key_parts = [key_prefix, func.__name__]

            # Add positional arguments
            for arg in args:
                if isinstance(arg, (int, str, float, bool)):
                    key_parts.append(str(arg))
                else:
                    # For complex objects, use their string representation
                    key_parts.append(str(hash(str(arg))))

            # Add keyword arguments (sorted for consistency)
            for k, v in sorted(kwargs.items()):
                key_parts.append(f"{k}={v}")

            # Create MD5 hash of cache key
            cache_key_string = ':'.join(key_parts)
            cache_key = hashlib.md5(cache_key_string.encode()).hexdigest()

            # Try to get from cache
            result = cache.get(cache_key, version=version)

            if result is not None:
                logger.debug(f"Cache HIT: {cache_key} ({func.__name__})")
                return result

            # Cache miss - execute function
            logger.debug(f"Cache MISS: {cache_key} ({func.__name__})")
            result = func(*args, **kwargs)

            # Store in cache
            cache.set(cache_key, result, timeout, version=version)

            return result

        # Add cache invalidation method
        def invalidate(*args, **kwargs):
            """Invalidate cache for specific arguments"""
            key_parts = [key_prefix, func.__name__]

            for arg in args:
                if isinstance(arg, (int, str, float, bool)):
                    key_parts.append(str(arg))
                else:
                    key_parts.append(str(hash(str(arg))))

            for k, v in sorted(kwargs.items()):
                key_parts.append(f"{k}={v}")

            cache_key_string = ':'.join(key_parts)
            cache_key = hashlib.md5(cache_key_string.encode()).hexdigest()
            cache.delete(cache_key, version=version)
            logger.debug(f"Cache INVALIDATED: {cache_key} ({func.__name__})")

        wrapper.invalidate = invalidate
        return wrapper

    return decorator


def invalidate_cache_pattern(pattern):
    """
    Invalidate all cache keys matching a pattern.

    Note: This requires Redis backend and may be slow for large caches.
    Use sparingly in production.

    Args:
        pattern (str): Pattern to match (e.g., 'student:*')
    """
    try:
        # This requires Redis backend
        from django_redis import get_redis_connection
        redis_conn = get_redis_connection("default")

        keys = redis_conn.keys(f"*{pattern}*")
        if keys:
            redis_conn.delete(*keys)
            logger.info(f"Invalidated {len(keys)} cache keys matching pattern: {pattern}")
    except Exception as e:
        logger.error(f"Failed to invalidate cache pattern '{pattern}': {str(e)}")


def get_cache_key(model_name, obj_id, action='detail'):
    """
    Generate a consistent cache key for model instances.

    Args:
        model_name (str): Name of the model (e.g., 'student', 'exam')
        obj_id (int): ID of the object
        action (str): Action type (e.g., 'detail', 'list', 'stats')

    Returns:
        str: Cache key
    """
    return f"{model_name}:{action}:{obj_id}"


def invalidate_model_cache(model_name, obj_id=None):
    """
    Invalidate all cache entries for a model instance or all instances.

    Args:
        model_name (str): Name of the model
        obj_id (int, optional): ID of specific instance. If None, invalidates all.
    """
    if obj_id:
        # Invalidate specific instance caches
        patterns = [
            f"{model_name}:detail:{obj_id}",
            f"{model_name}:stats:{obj_id}",
            f"{model_name}:grades:{obj_id}",
        ]
        for pattern in patterns:
            cache.delete(pattern)
            logger.debug(f"Invalidated cache: {pattern}")
    else:
        # Invalidate all instances (use sparingly)
        invalidate_cache_pattern(f"{model_name}:*")


class CacheStats:
    """
    Track cache hit/miss statistics (for monitoring)
    """

    @staticmethod
    def get_stats():
        """
        Get cache statistics from Redis.
        Requires Redis backend.
        """
        try:
            from django_redis import get_redis_connection
            redis_conn = get_redis_connection("default")

            info = redis_conn.info('stats')
            return {
                'keyspace_hits': info.get('keyspace_hits', 0),
                'keyspace_misses': info.get('keyspace_misses', 0),
                'hit_rate': round(
                    info.get('keyspace_hits', 0) /
                    max(info.get('keyspace_hits', 0) + info.get('keyspace_misses', 0), 1) * 100,
                    2
                ),
                'used_memory_human': info.get('used_memory_human', 'N/A'),
                'connected_clients': info.get('connected_clients', 0),
            }
        except Exception as e:
            logger.error(f"Failed to get cache stats: {str(e)}")
            return None


def warm_cache(func, args_list):
    """
    Pre-populate cache with common queries (cache warming).

    Args:
        func: Function to warm cache for
        args_list: List of argument tuples to pre-cache

    Example:
        warm_cache(get_student_grades, [
            (student_id1, 'FALL'),
            (student_id2, 'SPRING'),
        ])
    """
    for args in args_list:
        try:
            if isinstance(args, tuple):
                func(*args)
            else:
                func(args)
        except Exception as e:
            logger.error(f"Failed to warm cache for {func.__name__} with args {args}: {str(e)}")

"""
Local development settings for VariantBrowser.

Usage:
    1. Set DJANGO_SETTINGS_MODULE=variantbrowser.settings_local
    2. Or run: python manage.py runserver --settings=variantbrowser.settings_local
"""

import os
from pathlib import Path

# Set environment variables BEFORE importing from settings
os.environ.setdefault('SECRET_KEY', 'dev-secret-key-not-for-production-use-only')
os.environ.setdefault('DEBUG', 'true')
os.environ.setdefault('DJANGO_DATABASE_NAME', 'local')
os.environ.setdefault('DJANGO_DATABASE_USER', '')
os.environ.setdefault('DJANGO_DATABASE_PASSWORD', '')
os.environ.setdefault('DJANGO_DATABASE_SERVER', '')

# Now import base settings
from .settings import *

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Override DEBUG for local development
DEBUG = True

# Allow all hosts in development
ALLOWED_HOSTS = ['*']

# Use SQLite for local development (basic testing without Azure SQL)
# Note: This won't have real variant data - just for template/view testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
}

# Remove database router for SQLite mode
DATABASE_ROUTERS = []
DATABASE_APPS_MAPPING = {}

# Disable middleware that might cause issues in dev
MIDDLEWARE = [m for m in MIDDLEWARE if 'BlockBots' not in m]

# Static files configuration for development
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Simpler cache for development
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# Less verbose logging
LOGGING['root']['level'] = 'DEBUG'
LOGGING['loggers']['django']['level'] = 'DEBUG'

from django.http import HttpResponseForbidden
from django.utils.deprecation import MiddlewareMixin
import logging


class BlockBotsMiddleware(MiddlewareMixin):
    """Middleware that blocks requests from known abusive user agents."""

    BAD_AGENTS = [
        "facebook",
        "meta-externalagent",
        "amazonbot",
        "python-requests",
        "curl",
        "aiohttp",
        # Search engine bots causing worker timeouts and memory exhaustion
        "petalbot",          # Huawei search engine bot
        "semrushbot",        # SEMrush SEO crawler
        "bingbot",           # Microsoft Bing crawler
        "claudebot",         # Anthropic's web crawler
        # Other aggressive crawlers
        "ahrefsbot",         # Ahrefs SEO tool
        "mj12bot",           # Majestic SEO crawler
        "dotbot",            # Moz/OpenSiteExplorer
        "rogerbot",          # Moz SEO crawler
        "blexbot",           # BLEXBot crawler
        "serpstatbot",       # Serpstat SEO tool
        "dataforseobot",     # DataForSEO tool
    ]

    def process_request(self, request):
        user_agent = request.META.get("HTTP_USER_AGENT", "").lower()
        if any(bad_agent in user_agent for bad_agent in self.BAD_AGENTS):
            return HttpResponseForbidden("Bot access denied")

        return None


class SuppressHealthCheckLogsFilter(logging.Filter):
    """Logging filter to suppress health check requests from logs"""

    def filter(self, record):
        # Filter out health check requests
        if hasattr(record, 'request'):
            path = getattr(record.request, 'path', '')
            user_agent = record.request.META.get('HTTP_USER_AGENT', '')

            # Suppress logs for health check endpoints and Azure monitoring
            if path == '/api/health' or \
               'HealthCheck' in user_agent or \
               'ReadyForRequest' in user_agent:
                return False

        # For messages that contain health check patterns
        message = getattr(record, 'msg', '') or ''
        if isinstance(message, str):
            if '/api/health' in message or \
               'HealthCheck' in message or \
               'ReadyForRequest' in message:
                return False

        return True

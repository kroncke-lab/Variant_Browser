from django.http import HttpResponseForbidden
from django.utils.deprecation import MiddlewareMixin


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

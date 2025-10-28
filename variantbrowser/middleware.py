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
    ]

    def process_request(self, request):
        user_agent = request.META.get("HTTP_USER_AGENT", "").lower()
        if any(bad_agent in user_agent for bad_agent in self.BAD_AGENTS):
            return HttpResponseForbidden("Bot access denied")

        return None

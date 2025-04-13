from asyncio.log import logger
from django.http import JsonResponse


class MFACheckMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        response = self.get_response(request)
        return response
        
    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.user.is_authenticated:
            if not request.user.mfa_configured and not self._is_mfa_exempt_path(request.path):
                return JsonResponse(
                    {
                        "error": "MFA setup required",
                        "mfa_setup_required": True,
                        "setup_url": "/api/auth/mfa-setup/"
                    },
                    status=428
                )
    
    def _is_mfa_exempt_path(self, path):
        exempt_paths = [
        '/api/auth/register/',
        '/api/auth/verify-email/',
        ]
        return any(path.startswith(exempt) for exempt in exempt_paths)
    

class CombinedAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Try JWT auth first
        auth_header = request.headers.get('Authorization', '').split()
        
        if len(auth_header) == 2 and auth_header[0].lower() == 'bearer':
            try:
                from rest_framework_simplejwt.authentication import JWTAuthentication
                jwt_auth = JWTAuthentication()
                user, _ = jwt_auth.authenticate(request)
                if user:
                    request.user = user
                    request._jwt_authenticated = True
            except Exception:
                pass
                
        # Fall back to session auth
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            from django.contrib.auth.middleware import AuthenticationMiddleware
            auth_middleware = AuthenticationMiddleware(self.get_response)
            return auth_middleware(request)
            
        return self.get_response(request)
    



    

class SocialAuthErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if 'social-auth' in request.path:
            logger.error(f"Social auth middleware error: {str(exception)}", exc_info=True)
        return None
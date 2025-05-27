
from rest_framework.response import Response
from rest_framework import status

def error_response(detail: str, status_code=status.HTTP_400_BAD_REQUEST):
    """Helper for consistent error responses."""
    return Response({"detail": detail}, status=status_code)

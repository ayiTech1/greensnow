from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ShiftViewSet, ShiftApprovalViewSet,
    ShiftApplicationViewSet, ShiftAssignmentViewSet,
    NotificationViewSet, ShiftRatingViewSet
)

router = DefaultRouter()
router.register(r'shifts', ShiftViewSet)
router.register(r'shift-approvals', ShiftApprovalViewSet)
router.register(r'shift-applications', ShiftApplicationViewSet)
router.register(r'shift-assignments', ShiftAssignmentViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'shift-ratings', ShiftRatingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
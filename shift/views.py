from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.utils import timezone
from django.db.models import Q
from .models import (
    Shift, ShiftApproval, ShiftApplication,
    ShiftAssignment, Notification, ShiftRating
)
from .serializers import (
    ShiftSerializer, ShiftApprovalSerializer,
    ShiftApplicationSerializer, ShiftAssignmentSerializer,
    NotificationSerializer, ShiftRatingSerializer
)
from .permissions import (
    IsManager, IsEmployer, IsEmployee,
    IsShiftEmployerOrManager, IsApplicationEmployee,
    IsAssignmentEmployee, IsRatingParticipant
)

class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        qs = super().get_queryset()
        
        if self.request.user.is_manager():
            return qs.filter(
                Q(manager=self.request.user) | 
                Q(employer=self.request.user) | 
                Q(employer__in=self.request.user.managed_employers.all())
            ).distinct()
        elif self.request.user.is_employer():
            return qs.filter(employer=self.request.user)
        elif self.request.user.is_employee():
            return qs.filter(
                Q(status=ShiftStatus.PUBLISHED) |
                Q(applications__employee=self.request.user)
            ).distinct()
        return qs.none()
    
    def get_permissions(self):
        if self.action == 'create':
            if self.request.user.is_employer() or self.request.user.is_manager():
                return [IsAuthenticated()]
            return [PermissionDenied()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsShiftEmployerOrManager()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        if self.request.user.is_employer():
            serializer.save(employer=self.request.user)
        elif self.request.user.is_manager():
            serializer.save(manager=self.request.user)
        else:
            raise PermissionDenied("Only employers and managers can create shifts")
    
    @action(detail=True, methods=['post'], permission_classes=[IsManager])
    def approve(self, request, pk=None):
        shift = self.get_object()
        if shift.status != ShiftStatus.APPROVED:  
            return Response(
            {"error": "Only approved shifts can be published"},
            status=status.HTTP_400_BAD_REQUEST
        )
        try:
            shift.update_status(ShiftStatus.APPROVED, request.user)
            return Response({'status': 'shift approved'})
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsManager])
    def reject(self, request, pk=None):
        shift = self.get_object()
        try:
            shift.update_status(ShiftStatus.REJECTED, request.user)
            return Response({'status': 'shift rejected'})
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsEmployer | IsManager])
    def publish(self, request, pk=None):
        shift = self.get_object()
        try:
            shift.update_status(ShiftStatus.PUBLISHED, request.user)
            return Response({'status': 'shift published'})
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ShiftApprovalViewSet(viewsets.ModelViewSet):
    queryset = ShiftApproval.objects.all()
    serializer_class = ShiftApprovalSerializer
    permission_classes = [IsAuthenticated, IsManager]
    
    def get_queryset(self):
        return super().get_queryset().filter(manager=self.request.user)
    
    def perform_create(self, serializer):
        raise PermissionDenied("Cannot create approvals directly")

class ShiftApplicationViewSet(viewsets.ModelViewSet):
    queryset = ShiftApplication.objects.all()
    serializer_class = ShiftApplicationSerializer
    
    def get_queryset(self):
        qs = super().get_queryset()
        
        if self.request.user.is_manager():
            return qs.filter(shift__manager=self.request.user)
        elif self.request.user.is_employer():
            return qs.filter(shift__employer=self.request.user)
        elif self.request.user.is_employee():
            return qs.filter(employee=self.request.user)
        return qs.none()
    
    def get_permissions(self):
        if self.action in ['create']:
            self.permission_classes = [IsEmployee]
        elif self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsApplicationEmployee | IsEmployer | IsManager]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()
    
    @action(detail=True, methods=['post'], permission_classes=[IsEmployer | IsManager])
    def approve(self, request, pk=None):
        application = self.get_object()
        try:
            application.approve()
            return Response({'status': 'application approved'})
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsEmployer | IsManager])
    def reject(self, request, pk=None):
        application = self.get_object()
        try:
            application.reject()
            return Response({'status': 'application rejected'})
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ShiftAssignmentViewSet(viewsets.ModelViewSet):
    queryset = ShiftAssignment.objects.all()
    serializer_class = ShiftAssignmentSerializer
    
    def get_queryset(self):
        qs = super().get_queryset()
        
        if self.request.user.is_manager():
            return qs.all()
        elif self.request.user.is_employer():
            return qs.filter(shift__employer=self.request.user)
        elif self.request.user.is_employee():
            return qs.filter(employee=self.request.user)
        return qs.none()
    
    def get_permissions(self):
        if self.action in ['create']:
            self.permission_classes = [IsAuthenticated, IsEmployer | IsManager]
        elif self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsAssignmentEmployee | IsEmployer | IsManager]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAssignmentEmployee])
    def start(self, request, pk=None):
        assignment = self.get_object()
        try:
            assignment.mark_as_started()
            return Response({'status': 'shift started'})
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAssignmentEmployee])
    def complete(self, request, pk=None):
        assignment = self.get_object()
        notes = request.data.get('notes', '')
        try:
            assignment.mark_as_completed(notes=notes)
            return Response({'status': 'shift completed'})
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class NotificationViewSet(mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        viewsets.GenericViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all notifications marked as read'})

class ShiftRatingViewSet(viewsets.ModelViewSet):
    queryset = ShiftRating.objects.all()
    serializer_class = ShiftRatingSerializer
    permission_classes = [IsAuthenticated, IsRatingParticipant]
    
    def get_queryset(self):
        qs = super().get_queryset()
        
        if self.request.user.is_manager():
            return qs.all()
        elif self.request.user.is_employer():
            return qs.filter(
                Q(rater=self.request.user) | 
                Q(ratee=self.request.user) |
                Q(assignment__shift__employer=self.request.user)
            ).distinct()
        elif self.request.user.is_employee():
            return qs.filter(
                Q(rater=self.request.user) | 
                Q(ratee=self.request.user) |
                Q(assignment__employee=self.request.user)
            ).distinct()
        return qs.none()
    
    def perform_create(self, serializer):
        serializer.save(rater=self.request.user)
from rest_framework.exceptions import ValidationError
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from users.models import EmployerProfile, EmployeeProfile
from users.utils import send_notification
from users.serializers.user_profile_serializers import EmployerProfileSerializer, EmployeeProfileSerializer
from users.permissions import IsManager

class EmployerProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployerProfile.objects.all()
    serializer_class = EmployerProfileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['approval_status']

    def get_queryset(self):
        user = self.request.user
        if user.is_manager:
            return EmployerProfile.objects.all()
        elif user.is_employer:
            return EmployerProfile.objects.filter(user=user)
        return EmployerProfile.objects.none()

    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        try:
            profile = EmployerProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except EmployerProfile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)


    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user, approval_status='pending')
        send_notification(instance.user.email, 'submitted')

    def perform_update(self, serializer):
        instance = serializer.save(approval_status='pending')
        send_notification(instance.user.email, 'updated')


    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsManager])
    def approve(self, request, pk=None):
        profile = self.get_object()
        profile.approval_status = 'approved'
        profile.save()
        send_notification(profile.user.email, 'approved')
        return Response({'status': 'approved'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsManager])
    def reject(self, request, pk=None):
        profile = self.get_object()
        profile.approval_status = 'rejected'
        profile.save()
        send_notification(profile.user.email, 'rejected')
        return Response({'status': 'rejected'}, status=status.HTTP_200_OK)


class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['approval_status']

    def get_queryset(self):
        user = self.request.user
        if user.is_manager:
            return EmployeeProfile.objects.all()
        elif user.is_employer:
            return EmployeeProfile.objects.filter(company__user=user)
        return EmployeeProfile.objects.none()

    def list(self, request, *args, **kwargs):
        if not (request.user.is_manager or request.user.is_employer):
            return Response({'detail': 'You are not authorized to view all employee profiles.'}, status=status.HTTP_403_FORBIDDEN)
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = self.request.user
        if EmployeeProfile.objects.filter(user=user).exists():
            raise ValidationError("You already have a profile.")
    
        serializer.save(user=user, approval_status='pending')

    def perform_update(self, serializer):
        instance = serializer.save(approval_status='pending')
        send_notification(instance.user.email, instance.user.first_name, 'updated')


    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsManager])
    def approve(self, request, pk=None):
        profile = self.get_object()
        profile.approval_status = 'approved'
        profile.save()
        send_notification(profile.user.email, 'approved')
        return Response({'status': 'approved'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsManager])
    def reject(self, request, pk=None):
        profile = self.get_object()
        profile.approval_status = 'rejected'
        profile.save()
        send_notification(profile.user.email, 'rejected')
        return Response({'status': 'rejected'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        try:
            profile = EmployeeProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except EmployeeProfile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsManager])
    def pending(self, request):
        pending_profiles = EmployeeProfile.objects.filter(approval_status='pending')
        serializer = self.get_serializer(pending_profiles, many=True)
        return Response(serializer.data)


        
    


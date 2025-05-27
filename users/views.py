from rest_framework import  viewsets
from rest_framework.decorators import action
from users.serializers import EmployerProfileSerializer, EmployeeProfileSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsManager
from users.employer import (
    get_employer_queryset,
    list_employer_profiles,
    update_employer_profile,
    me_employer_profile,
    status_employeer_profile,  
)
from users.employee import (
    get_employee_queryset,
    list_employee_profiles,
    update_employee_profile,
    me_employee_profile,
    status_employee_profile, 
)
from users.manager import (
    approve_employer_profile_action,
    reject_employer_profile_action,
    approve_employee_profile_action,
    reject_employee_profile_action,
)

class EmployerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = EmployerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_employer_queryset(self.request.user)

    def list(self, request, *args, **kwargs):
        return list_employer_profiles(request, self)


    def perform_update(self, serializer):
        update_employer_profile(serializer)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsManager])
    def approve(self, request, pk=None):
        return approve_employer_profile_action(self, request, pk)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsManager])
    def reject(self, request, pk=None):
        return reject_employer_profile_action(self, request, pk)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        return me_employer_profile(self, request)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def status(self, request):
        return status_employeer_profile(self, request)

    
    
    

class EmployeeProfileViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_employee_queryset(self.request.user)

    def list(self, request, *args, **kwargs):
        return list_employee_profiles(request, self)


    def perform_update(self, serializer):
        update_employee_profile(serializer)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsManager])
    def approve(self, request, pk=None):
        return approve_employee_profile_action(self, request, pk)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsManager])
    def reject(self, request, pk=None):
        return reject_employee_profile_action(self, request, pk)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        return me_employee_profile(self, request)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def status(self, request):
        return status_employee_profile(self, request)


from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from shift.permissions import CanViewShift, CanEditShift, IsManagerOrEmployer, IsManager, IsEmployee
from shift.serializers import (ShiftSerializer, ShiftAssignmentSerializer, ShiftRatingSerializer)
from shift.services.shift.actions.create import create_shift
from shift.services.shift.actions.update import update_shift
from shift.services.shift.actions.delete import delete_shift
from shift.services.shift.actions.approval import approve_shift
from shift.services.shift.actions.reject import reject_shift
from shift.services.shift.actions.rating import rate_shift
from shift.services.shift.gets.approved import get_approved_shifts_for_user
from shift.services.shift.gets.pending import get_pending_shifts_for_user
from shift.services.shift.gets.taken import get_taken_shift_assignments_for_user
from shift.services.assignment.assign import assign_shift_to_employee
from shift.services.assignment.start import start_shift_assignment
from shift.services.assignment.cancel import cancel_shift_assignment
from shift.services.assignment.complete import complete_shift_assignment

def success_response(data, message="Success", status_code=status.HTTP_200_OK):
    return Response({"data": data, "message": message}, status=status_code)

def error_response(message="Error", status_code=status.HTTP_400_BAD_REQUEST):
    return Response({"data": None, "message": message}, status=status_code)


class ShiftViewSet(viewsets.ModelViewSet):
    serializer_class = ShiftSerializer
    permission_classes = [IsAuthenticated, CanViewShift]

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), CanEditShift()]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        shift = create_shift(request.user, serializer.validated_data)
        return success_response(self.get_serializer(shift).data, message="Shift created", status_code=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        shift = self.get_object()
        self.check_object_permissions(request, shift)
        serializer = self.get_serializer(shift, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_shift = update_shift(request.user, shift, serializer.validated_data)
        return success_response(self.get_serializer(updated_shift).data, message="Shift updated")

    def destroy(self, request, *args, **kwargs):
        shift = self.get_object()
        self.check_object_permissions(request, shift)
        delete_shift(request.user, shift)
        return success_response(None, message="Shift deleted", status_code=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsManagerOrEmployer])
    def pending(self, request):
        shifts = get_pending_shifts_for_user(request.user)
        serializer = self.get_serializer(shifts, many=True)
        return success_response(serializer.data, "Pending shifts retrieved")

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsManagerOrEmployer])
    def approved(self, request):
        shifts = get_approved_shifts_for_user(request.user)
        serializer = self.get_serializer(shifts, many=True)
        return success_response(serializer.data, "Approved shifts retrieved")

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsManagerOrEmployer])
    def taken(self, request):
        assignments = get_taken_shift_assignments_for_user(request.user)
        serializer = self.get_serializer(assignments, many=True)
        return success_response(serializer.data, "Taken shifts retrieved")

    @action(detail=True, methods=['post'], url_path='approve', permission_classes=[IsAuthenticated, IsManager])
    def approve_shift(self, request, pk=None):
        shift = approve_shift(request.user, int(pk))
        return success_response(self.get_serializer(shift).data, "Shift approved")

    @action(detail=True, methods=['post'], url_path='reject', permission_classes=[IsAuthenticated, IsManager])
    def reject_shift(self, request, pk=None):
        reason = request.data.get('reason', '')
        shift = reject_shift(request.user, int(pk), reason)
        return success_response(self.get_serializer(shift).data, "Shift rejected")

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsEmployee])
    def assign(self, request, pk=None):
        assignment = assign_shift_to_employee(request.user, pk)
        return success_response(ShiftAssignmentSerializer(assignment).data, "Shift assigned", status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsEmployee])
    def start(self, request, pk=None):
        assignment = start_shift_assignment(request.user, pk)
        return success_response(ShiftAssignmentSerializer(assignment).data, "Shift started")

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsEmployee])
    def cancel(self, request, pk=None):
        confirm = request.data.get('confirm', False)
        result = cancel_shift_assignment(request.user, pk, confirm=confirm)
        return success_response(result, "Shift cancel processed")

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsEmployee])
    def complete(self, request, pk=None):
        notes = request.data.get('completed_notes', None)
        assignment = complete_shift_assignment(request.user, pk, completed_notes=notes)
        return success_response(ShiftAssignmentSerializer(assignment).data, "Shift completed")

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def rate(self, request):
        serializer = ShiftRatingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        shift_rating = rate_shift(
            user=request.user,
            assignment_id=serializer.validated_data["assignment"].id,
            rating=serializer.validated_data["rating"],
            review=serializer.validated_data.get("review", "")
        )

        return success_response(ShiftRatingSerializer(shift_rating).data, "Shift rated", status.HTTP_201_CREATED)

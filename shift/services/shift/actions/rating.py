import logging
from django.core.exceptions import ValidationError, PermissionDenied
from users.models import User
from shift.models import ShiftAssignment, ShiftRating
from django.db import transaction
from django.db.models import F




logger = logging.getLogger('ratings')

@transaction.atomic
def rate_shift(user: User, assignment_id: str, rating: int, review: str = '') -> ShiftRating:
    try:
        assignment = ShiftAssignment.objects.select_related('shift', 'employee', 'shift__employer').get(id=assignment_id)
    except ShiftAssignment.DoesNotExist:
        logger.warning(f"Rating attempt failed: Assignment {assignment_id} not found by user {user.id}.")
        raise ValidationError({"detail": "Shift assignment not found."})

    # ✅ Ensure the shift has been completed
    if assignment.status != 'completed':
        raise ValidationError({"detail": "You can only rate a shift after it has been completed."})

    # Determine if the user is allowed to rate
    if user == assignment.employee:
        rater = user
        ratee = assignment.shift.employer
    elif user == assignment.shift.employer:
        rater = user
        ratee = assignment.employee
    else:
        logger.warning(f"Permission denied: User {user.id} tried to rate assignment {assignment_id}.")
        raise PermissionDenied("You are not allowed to rate this shift.")

    # Prevent duplicate rating
    if ShiftRating.objects.filter(assignment=assignment, rater=rater).exists():
        logger.info(f"Duplicate rating attempt by user {rater.id} on assignment {assignment_id}.")
        raise ValidationError({"detail": "You have already rated this shift assignment."})

    # Create the rating
    shift_rating = ShiftRating.objects.create(
        shift=assignment.shift,
        assignment=assignment,
        rater=rater,
        ratee=ratee,
        rating=rating,
        review=review
    )

    # Update ratee's rating
    ratee.total_rating = F('total_rating') + rating
    ratee.rating_count = F('rating_count') + 1
    ratee.save(update_fields=['total_rating', 'rating_count'])

    # Recalculate average
    ratee.refresh_from_db(fields=['total_rating', 'rating_count'])
    ratee.average_rating = round(ratee.total_rating / ratee.rating_count, 2)
    ratee.save(update_fields=['average_rating'])

    logger.info(
        f"User {rater.id} rated user {ratee.id} (assignment {assignment_id}) with rating {rating}. "
        f"New average: {ratee.average_rating} from {ratee.rating_count} ratings."
    )

    return shift_rating

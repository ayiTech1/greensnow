
def get_user_filtered_queryset(user, model):
    try:
        return model.objects.filter(user=user)
    except model.DoesNotExist:
        return model.objects.none()


def get_user_profile(user, model):
    try:
        return model.objects.get(user=user)
    except model.DoesNotExist:
        return None  


def get_profiles_by_status(status_value, model):
    try:
        return model.objects.filter(approval_status=status_value)
    except model.DoesNotExist:
        return None
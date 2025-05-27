from users.models import User

def prepare_otp_session(request, user, method=None, identifier=None, purpose=None):
    request.session['otp_user_id'] = user.id
    request.session['otp_email'] = user.email
    request.session['otp_phone'] = user.phone_number
    if method:
        request.session['otp_method'] = method
    if identifier:
        request.session['otp_identifier'] = identifier
    if purpose:
        request.session['otp_purpose'] = purpose
    request.session.modified = True

def clear_otp_session(request):
    keys = ['otp_user_id', 'otp_email', 'otp_phone', 'otp_method', 'otp_identifier', 'otp_purpose']
    for key in keys:
        request.session.pop(key, None)

def prepare_registration_session(request, data):
    if 'registration' not in request.session:
        request.session['registration'] = {}
    request.session['registration'].update(data)
    request.session.modified = True

def clear_registration_session(request):
    request.session.pop('registration', None)

def get_otp_user_from_session(request):
    user_id = request.session.get('otp_user_id')
    if not user_id:
        return None
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

def get_otp_method_from_session(request):
    return request.session.get('otp_method')

def get_otp_identifier_from_session(request):
    return request.session.get('otp_identifier')

def get_otp_purpose_from_session(request):
    return request.session.get('otp_purpose')

def prepare_password_reset_session(request, user):
    request.session['password_reset'] = {
        'user_id': user.id,
        'email': user.email,
        'verified': False
    }
    request.session.modified = True

def clear_password_reset_session(request):
    request.session.pop('password_reset', None)

def get_password_reset_user(request):
    session_data = request.session.get('password_reset', {})
    user_id = session_data.get('user_id')
    if not user_id:
        return None
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

from django.urls import include, path

urlpatterns = [
    path('auth/', include('authentications.urls')),
    path('user/', include('users.urls')),    
    path('shift/', include('shift.urls')), 
]

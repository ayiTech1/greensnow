from django.urls import include, path

urlpatterns = [
    path('', include('users.urls')),    
    path('api/', include('shift.urls')), 
]

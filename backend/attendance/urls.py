from django.urls import path
from .views import my_attendance

urlpatterns = [
    path('api/my-attendance/', my_attendance, name='my-attendance'),
]
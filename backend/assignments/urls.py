from django.urls import path
from .views import my_assignments


urlpatterns = [
    path(
        'api/my-assignments/', my_assignments,name='my-assignments'
    ),
]
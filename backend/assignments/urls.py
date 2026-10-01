from django.urls import path
from .views import (
    my_assignments,
    create_assignment,
    faculty_assignments
)

urlpatterns = [
    path(
        'api/my-assignments/',
        my_assignments,name='my-assignments'
    ),
    path(
    'api/create-assignment/',
    create_assignment,
    name='create-assignment'
    ),
    path(
    'api/faculty-assignments/',
    faculty_assignments,
    name='faculty-assignments'
    ),
]
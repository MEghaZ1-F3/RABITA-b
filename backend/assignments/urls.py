from django.urls import path
from .views import (
    my_assignments,
    create_assignment,
    faculty_assignments,
    submit_assignment,
    faculty_submissions,
    review_submission
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
    path(
        'api/submit-assignment/',
        submit_assignment,
        name='submit-assignment'
    ),
    path(
        'api/faculty-submissions/',
        faculty_submissions,
        name='faculty-submissions'
    ),
    path(
        'api/review-submission/',
        review_submission,
        name='review-submission'
    ),
]
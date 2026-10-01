from django.urls import path
from .views import faculty_subjects


urlpatterns = [
    path(
        'api/faculty-subjects/',
        faculty_subjects,
        name='faculty-subjects'
    ),
]
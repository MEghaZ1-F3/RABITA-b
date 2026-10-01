from django.urls import path
from .views import my_attendance, my_students_attendance


urlpatterns = [
    path(
        'api/my-attendance/',
        my_attendance,
        name='my-attendance'
    ),

    path(
        'api/my-students-attendance/',
        my_students_attendance,
        name='my-students-attendance'
    ),
]
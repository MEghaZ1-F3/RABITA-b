from django.urls import path
from .views import( my_attendance,
    my_students_attendance,
    save_attendance,
    get_attendance,
    my_attendance_summary
)

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
    path(
        'api/save-attendance/',
        save_attendance,
        name='save-attendance'
    ),
    path(
        'api/get-attendance/',
        get_attendance,
        name='get-attendance'
    ),
    path(
        'api/my-attendance-summary/',
        my_attendance_summary,
        name='my-attendance-summary'
    )
]
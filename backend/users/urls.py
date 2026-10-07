from django.urls import path
from .views import student_list,faculty_list,login_view, me_view,logout_view, update_student_approval

urlpatterns = [
    path('api/login/', login_view, name='login'),
    path('api/me/', me_view, name='me'),
    path('students/', student_list, name='student-list'),
    path('faculty/', faculty_list, name='faculty-list'),
    path('api/logout/', logout_view, name='logout'),
   path('api/update-student-approval/',update_student_approval, name='update-student-approval'),
]

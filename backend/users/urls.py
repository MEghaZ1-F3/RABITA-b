from django.urls import path
from .views import student_list, login_view, me_view

urlpatterns = [
    path('api/login/', login_view, name='login'),
    path('api/me/', me_view, name='me'),
    path('students/', student_list, name='student-list'),
]

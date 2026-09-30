from django.urls import path
from .views import notice_list


urlpatterns = [
    path(
        'api/notices/',
        notice_list,
        name='notice-list'
    ),
]
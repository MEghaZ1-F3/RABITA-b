from django.urls import path
from .views import my_results


urlpatterns = [
    path(
        'api/my-results/',my_results,name='my-results'
    ),
]
from django.urls import path
from .views import my_results, save_internal_marks, get_internal_marks,upload_semester_result


urlpatterns = [
    path(
        'api/my-results/',my_results,name='my-results'
    ),
   path(
        'api/save-internal-marks/',save_internal_marks,name='save-internal-marks'
    ),
    path(
        'api/get-internal-marks/',get_internal_marks,name='get-internal-marks'
    ),
    path(
        'api/upload-semester-result/',upload_semester_result,name='upload-semester-result'
    ),
]
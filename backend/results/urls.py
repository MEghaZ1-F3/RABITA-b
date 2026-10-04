from django.urls import path
from .views import(
     my_results,
     save_internal_marks,
     get_internal_marks,
     upload_semester_result,
     faculty_semester_results,
     review_semester_result,
     my_semester_results
)


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
    path(
        'api/faculty-semesters-results/',faculty_semester_results,name='faculty-semesters-results'
    ),
    path(
        'api/review-semester-result/',review_semester_result,name='review-semester-result'
    ),
    path(
        'api/my-semester-results/',my_semester_results,name='my-semester-results'
    )
]
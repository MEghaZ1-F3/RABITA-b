from django.http import JsonResponse
from .models import Result


def my_results(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    results = Result.objects.filter(
        student=request.user
    ).order_by('semester', 'subject')

    data = []

    for result in results:
        data.append({
            'subject': result.subject,
            'marks': result.marks,
            'max_marks': result.max_marks,
            'grade': result.grade,
            'semester': result.semester,
        })

    return JsonResponse({
        'results': data
    })
from django.http import JsonResponse
from .models import Subject


def faculty_subjects(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    if request.user.role != 'faculty':
        return JsonResponse(
            {'error': 'Access denied'},
            status=403
        )

    branch = request.GET.get('branch')
    semester = request.GET.get('semester')

    if not branch or not semester:
        return JsonResponse({
            'subjects': []
        })

    subjects = Subject.objects.filter(
        branch=branch,
        semester=semester
    )

    data = []

    for subject in subjects:
        data.append({
            'id': subject.id,
            'name': subject.subject_name,
        })

    return JsonResponse({
        'subjects': data
    })
from django.http import JsonResponse
from .models import Assignment


def my_assignments(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    assignments = Assignment.objects.filter(
        student=request.user
    ).order_by('due_date')

    data = []

    for assignment in assignments:
        data.append({
            'subject': assignment.subject,
            'title': assignment.title,
            'description': assignment.description,
            'due_date': assignment.due_date,
            'submitted': assignment.submitted,
        })

    return JsonResponse({
        'assignments': data
    })
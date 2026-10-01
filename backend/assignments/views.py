from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Assignment
from subjects.models import Subject
import json


def my_assignments(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    assignments = Assignment.objects.filter(
        subject_ref__branch=request.user.branch,
        subject_ref__semester=request.user.semester
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


@csrf_exempt
def create_assignment(request):

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

    if request.method != 'POST':
        return JsonResponse(
            {'error': 'POST method required'},
            status=405
        )

    data = json.loads(request.body)

    subject_id = data.get('subject_id')
    title = data.get('title')
    description = data.get('description')
    due_date = data.get('due_date')

    if not subject_id or not title or not due_date:
        return JsonResponse(
            {'error': 'Subject, title and due date are required'},
            status=400
        )

    subject = Subject.objects.get(id=subject_id)

    if subject.faculty != request.user:
        return JsonResponse(
            {'error': 'You are not assigned to this subject'},
            status=403
        )

    assignment = Assignment.objects.create(
        subject=subject.subject_name,
        subject_ref=subject,
        title=title,
        description=description or '',
        due_date=due_date
    )

    return JsonResponse({
        'message': 'Assignment created successfully',
        'assignment_id': assignment.id,
        'subject': subject.subject_name,
        'title': assignment.title,
        'due_date': assignment.due_date
    })
def faculty_assignments(request):

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

    assignments = Assignment.objects.filter(
        subject_ref__faculty=request.user
    ).select_related('subject_ref').order_by('due_date')

    data = []

    for assignment in assignments:

        data.append({
            'id': assignment.id,
            'title': assignment.title,
            'subject': assignment.subject_ref.subject_name,
            'due_date': assignment.due_date,
            'description': assignment.description,
        })

    return JsonResponse({
        'assignments': data
    })
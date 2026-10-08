from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Assignment, AssignmentSubmission
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

        submission = AssignmentSubmission.objects.filter(
            assignment=assignment,
            student=request.user
        ).first()

        if submission:
            status = submission.status
        else:
            status = 'pending'

        data.append({
            'id': assignment.id,
            'subject': assignment.subject,
            'title': assignment.title,
            'description': assignment.description,
            'due_date': assignment.due_date,
            'status': status,
            'hard_copy_received': (
                submission.hard_copy_received
                if submission
                else False
            ),
            'professor_remarks': (
                submission.professor_remarks
                if submission
                else ''
            )
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

        submission_count = AssignmentSubmission.objects.filter(
            assignment=assignment
        ).count()

        data.append({
            'id': assignment.id,
            'title': assignment.title,
            'subject': assignment.subject_ref.subject_name,
            'due_date': assignment.due_date,
            'description': assignment.description,
            'submissions_count': submission_count,
        })

    return JsonResponse({
        'assignments': data
    })
@csrf_exempt
def submit_assignment(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    if request.user.role != 'student':
        return JsonResponse(
            {'error': 'Only students can submit assignments'},
            status=403
        )

    if request.method != 'POST':
        return JsonResponse(
            {'error': 'POST method required'},
            status=405
        )

    assignment_id = request.POST.get('assignment_id')
    soft_copy = request.FILES.get('soft_copy')

    if not assignment_id or not soft_copy:
        return JsonResponse(
            {'error': 'Assignment and soft copy are required'},
            status=400
        )

    try:
        assignment = Assignment.objects.get(
            id=assignment_id
        )
    except Assignment.DoesNotExist:
        return JsonResponse(
            {'error': 'Assignment not found'},
            status=404
        )
    existing_submission = AssignmentSubmission.objects.filter(
        assignment=assignment,
        student=request.user
    ).first()
    if existing_submission:

        if existing_submission.status == 'approved':
            return JsonResponse(
                {'error': "Don't be smart, This assignment is already approved."},
                status=400
            )

        if existing_submission.status == 'rejected':
            existing_submission.soft_copy = soft_copy
            existing_submission.status = 'pending'
            existing_submission.professor_remarks = ''
            existing_submission.hard_copy_received = False
            existing_submission.save()

            return JsonResponse({
                'message': 'Assignment resubmitted successfully',
                'submission_id': existing_submission.id,
                'status': existing_submission.status
            })

        return JsonResponse(
            {'error': 'Just wait, Assignment is already submitted and under review.'},
            status=400
        )

    submission = AssignmentSubmission.objects.create(
        assignment=assignment,
        student=request.user,
        soft_copy=soft_copy
    )

    return JsonResponse({
        'message': 'Assignment submitted successfully',
        'submission_id': submission.id,
        'status': submission.status
    })
def faculty_submissions(request):

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

    submissions = AssignmentSubmission.objects.filter(
        assignment__subject_ref__faculty=request.user
    ).select_related(
        'student',
        'assignment'
    ).order_by(
        '-submitted_at'
    )

    data = []

    for submission in submissions:

        data.append({
            'id': submission.id,
            'assignment_id': submission.assignment.id,
            'student': submission.student.username,
            'assignment': submission.assignment.title,
            'subject': submission.assignment.subject,
            'submitted_at': submission.submitted_at,
            'status': submission.status,
            'professor_remarks': submission.professor_remarks,
            'soft_copy_url': submission.soft_copy.url,
        })

    return JsonResponse({
        'submissions': data
    })
@csrf_exempt
def review_submission(request):

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

    submission_id = data.get('submission_id')
    status = data.get('status')
    remarks = data.get('remarks', '')
    hard_copy_received = data.get('hard_copy_received', False)

    if not submission_id or status not in ['approved', 'rejected']:
        return JsonResponse(
            {'error': 'Invalid submission or status'},
            status=400
        )

    try:
        submission = AssignmentSubmission.objects.get(
            id=submission_id
        )
    except AssignmentSubmission.DoesNotExist:
        return JsonResponse(
            {'error': 'Submission not found'},
            status=404
        )

    if submission.assignment.subject_ref.faculty != request.user:
        return JsonResponse(
            {'error': 'You are not allowed to review this submission'},
            status=403
        )

    submission.status = status
    submission.professor_remarks = remarks
    submission.hard_copy_received = hard_copy_received
    submission.save()

    return JsonResponse({
        'message': 'Submission reviewed successfully',
        'status': submission.status,
        'remarks': submission.professor_remarks
    })
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import User
from subjects.models import Subject
from .models import Result, InternalMarks, SemesterResult


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
@csrf_exempt
def save_internal_marks(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Login required'}, status=401)

    if request.user.role != 'faculty':
        return JsonResponse({'error': 'Only faculty can save marks'}, status=403)

    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)

    data = json.loads(request.body)

    student_id = data.get('student_id')
    subject_id = data.get('subject_id')
    semester = data.get('semester')
    ct1_marks = data.get('ct1_marks', 0)
    ct2_marks = data.get('ct2_marks', 0)

    if not student_id or not subject_id or not semester:
        return JsonResponse({
            'error': 'Student, subject and semester are required'
        }, status=400)

    try:
        student = User.objects.get(
            id=student_id,
            role='student'
        )

        subject = Subject.objects.get(
            id=subject_id,
            faculty=request.user
        )

    except User.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)

    except Subject.DoesNotExist:
        return JsonResponse({
            'error': 'Subject not assigned to this faculty'
        }, status=403)

    marks, created = InternalMarks.objects.update_or_create(
        student=student,
        subject=subject,
        semester=semester,
        defaults={
            'ct1_marks': ct1_marks,
            'ct2_marks': ct2_marks,
        }
    )

    return JsonResponse({
        'message': 'Internal marks saved successfully',
        'id': marks.id,
        'ct1_marks': marks.ct1_marks,
        'ct2_marks': marks.ct2_marks,
    })
def get_internal_marks(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    if request.user.role != 'faculty':
        return JsonResponse(
            {'error': 'Only faculty can view marks'},
            status=403
        )

    student_id = request.GET.get('student_id')
    subject_id = request.GET.get('subject_id')
    semester = request.GET.get('semester')

    if not student_id or not subject_id or not semester:
        return JsonResponse(
            {'error': 'Student, subject and semester are required'},
            status=400
        )

    try:
        marks = InternalMarks.objects.get(
            student_id=student_id,
            subject_id=subject_id,
            semester=semester,
            subject__faculty=request.user
        )
    except InternalMarks.DoesNotExist:
        return JsonResponse({
            'exists': False,
            'ct1_marks': 0,
            'ct2_marks': 0
        })

    return JsonResponse({
        'exists': True,
        'ct1_marks': marks.ct1_marks,
        'ct2_marks': marks.ct2_marks
    })
@csrf_exempt
def upload_semester_result(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    if request.user.role != 'student':
        return JsonResponse(
            {'error': 'Only students can upload results'},
            status=403
        )

    if request.method != 'POST':
        return JsonResponse(
            {'error': 'POST method required'},
            status=405
        )

    semester = request.POST.get('semester')
    result_file = request.FILES.get('result_file')

    if not semester or not result_file:
        return JsonResponse(
            {'error': 'Semester and result file are required'},
            status=400
        )

    existing_result = SemesterResult.objects.filter(
        student=request.user,
        semester=semester
    ).first()

    if existing_result:
        if existing_result.status == 'approved':
            return JsonResponse(
                {'error': 'This semester result is already approved.'},
                status=400
            )

        existing_result.result_file = result_file
        existing_result.status = 'pending'
        existing_result.faculty_remarks = ''
        existing_result.save()

        return JsonResponse({
            'message': 'Result re-uploaded successfully',
            'status': existing_result.status
        })

    result = SemesterResult.objects.create(
        student=request.user,
        semester=semester,
        result_file=result_file
    )

    return JsonResponse({
        'message': 'Semester result uploaded successfully',
        'result_id': result.id,
        'status': result.status
    })
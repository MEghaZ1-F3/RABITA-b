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
    if not (0 <= int(ct1_marks) <= 20):
        return JsonResponse(
            {'error': 'CT-1 marks must be between 0 and 20'},
            status=400
        )

    if not (0 <= int(ct2_marks) <= 20):
        return JsonResponse(
            {'error': 'CT-2 marks must be between 0 and 20'},
            status=400
        )

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
def my_internal_marks(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    if request.user.role != 'student':
        return JsonResponse(
            {'error': 'Only students can view marks'},
            status=403
        )

    marks_list = InternalMarks.objects.filter(
        student=request.user
    ).select_related('subject').order_by(
        'semester',
        'subject__subject_name'
    )

    data = []

    for marks in marks_list:
        data.append({
            'semester': marks.semester,
            'subject': marks.subject.subject_name,
            'ct1_marks': marks.ct1_marks,
            'ct2_marks': marks.ct2_marks,
            'total': marks.ct1_marks + marks.ct2_marks
        })

    return JsonResponse({
        'marks': data
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
def faculty_semester_results(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    if request.user.role != 'faculty':
        return JsonResponse(
            {'error': 'Only faculty can view results'},
            status=403
        )

    results = SemesterResult.objects.filter(
        student__role='student',
        student__branch=request.user.branch
    ).select_related('student').order_by('-uploaded_at')

    data = []

    for result in results:
        data.append({
            'id': result.id,
            'student_name': result.student.username,
            'student_id': (
                result.student.student_id
                or result.student.temporary_id
            ),
            'semester': result.semester,
            'status': result.status,
            'result_file': request.build_absolute_uri(
                result.result_file.url
            ),
            'faculty_remarks': result.faculty_remarks,
            'uploaded_at': result.uploaded_at,
        })

    return JsonResponse({'results': data})
@csrf_exempt
def review_semester_result(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    if request.user.role != 'faculty':
        return JsonResponse(
            {'error': 'Only faculty can review results'},
            status=403
        )

    if request.method != 'POST':
        return JsonResponse(
            {'error': 'POST method required'},
            status=405
        )

    data = json.loads(request.body)

    result_id = data.get('result_id')
    status = data.get('status')
    remarks = data.get('remarks', '')

    if not result_id or status not in ['approved', 'rejected']:
        return JsonResponse(
            {'error': 'Invalid result or status'},
            status=400
        )

    if status == 'rejected' and not remarks.strip():
        return JsonResponse(
            {'error': 'Remarks are required when rejecting a result'},
            status=400
        )

    try:
        result = SemesterResult.objects.get(
            id=result_id,
            student__branch=request.user.branch
        )
    except SemesterResult.DoesNotExist:
        return JsonResponse(
            {'error': 'Result not found or access denied'},
            status=404
        )

    result.status = status
    result.faculty_remarks = remarks
    result.save()

    return JsonResponse({
        'message': 'Result reviewed successfully',
        'status': result.status,
        'remarks': result.faculty_remarks
    })
def my_semester_results(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    if request.user.role != 'student':
        return JsonResponse(
            {'error': 'Only students can view results'},
            status=403
        )

    results = SemesterResult.objects.filter(
        student=request.user
    ).order_by('-semester')

    data = []

    for result in results:
        data.append({
            'id': result.id,
            'semester': result.semester,
            'status': result.status,
            'result_file': request.build_absolute_uri(
                result.result_file.url
            ),
            'faculty_remarks': result.faculty_remarks,
            'uploaded_at': result.uploaded_at,
        })

    return JsonResponse({'results': data})
from django.http import JsonResponse
from .models import Attendance


def my_attendance(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    records = Attendance.objects.filter(
        student=request.user
    )

    data = []

    total_classes = 0
    total_present = 0

    for record in records:
        data.append({
            'subject': record.subject,
            'total_classes': record.total_classes,
            'present_classes': record.present_classes,
            'percentage': record.percentage,
        })

        total_classes += record.total_classes
        total_present += record.present_classes

    overall_percentage = (
        round(total_present / total_classes * 100, 2)
        if total_classes else 0
    )

    return JsonResponse({
        'records': data,
        'overall_percentage': overall_percentage
    })
def my_students_attendance(request):

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

    records = Attendance.objects.filter(
        student__branch=request.user.branch
    ).select_related('student')

    data = []

    for record in records:

        data.append({
            'student': record.student.username,
            'student_id': (
                record.student.student_id
                or record.student.temporary_id
            ),
            'subject': record.subject,
            'total_classes': record.total_classes,
            'present_classes': record.present_classes,
            'percentage': record.percentage,
        })

    return JsonResponse({
        'records': data
    })

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json

from users.models import User
from subjects.models import Subject
from .models import Attendance


@csrf_exempt
def save_attendance(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    if request.user.role != 'faculty':
        return JsonResponse(
            {'error': 'Only faculty can mark attendance'},
            status=403
        )

    if request.method != 'POST':
        return JsonResponse(
            {'error': 'POST method required'},
            status=405
        )

    try:
        data = json.loads(request.body)

        student_id = data.get('student_id')
        subject_id = data.get('subject_id')
        date = data.get('date')
        class_number = data.get('class_number')
        status = data.get('status')

        if not all([
            student_id,
            subject_id,
            date,
            class_number,
            status
        ]):
            return JsonResponse(
                {'error': 'All attendance fields are required'},
                status=400
            )

        if status not in ['present', 'absent']:
            return JsonResponse(
                {'error': 'Invalid attendance status'},
                status=400
            )

        student = get_object_or_404(
            User,
            id=student_id,
            role='student'
        )

        subject = get_object_or_404(
            Subject,
            id=subject_id
        )

        # Faculty sirf apne assigned subject ki
        # attendance mark kar sakta hai
        if subject.faculty != request.user:
            return JsonResponse(
                {'error': 'You are not assigned to this subject'},
                status=403
            )

        # Student aur subject same branch ke hone chahiye
        if student.branch != subject.branch:
            return JsonResponse(
                {'error': 'Student does not belong to this subject branch'},
                status=400
            )

        # Student aur subject same semester ke hone chahiye
        if student.semester != subject.semester:
            return JsonResponse(
                {'error': 'Student does not belong to this subject semester'},
                status=400
            )

        attendance, created = Attendance.objects.update_or_create(
            student=student,
            subject=subject,
            date=date,
            class_number=class_number,
            defaults={
                'status': status
            }
        )

        return JsonResponse({
            'message': 'Attendance saved successfully',
            'attendance_id': attendance.id,
            'status': attendance.status,
            'created': created
        })

    except json.JSONDecodeError:
        return JsonResponse(
            {'error': 'Invalid JSON data'},
            status=400
        )

    except Exception as error:
        return JsonResponse(
            {'error': str(error)},
            status=500
        )
def get_attendance(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    if request.user.role != 'faculty':
        return JsonResponse(
            {'error': 'Only faculty can view attendance'},
            status=403
        )

    subject_id = request.GET.get('subject_id')
    date = request.GET.get('date')
    class_number = request.GET.get('class_number')

    if not subject_id or not date or not class_number:
        return JsonResponse(
            {'error': 'Subject, date and class number are required'},
            status=400
        )

    try:

        subject = Subject.objects.get(
            id=subject_id,
            faculty=request.user
        )

    except Subject.DoesNotExist:

        return JsonResponse(
            {'error': 'Subject not found or access denied'},
            status=404
        )

    attendance_records = Attendance.objects.filter(
        subject=subject,
        date=date,
        class_number=class_number
    ).select_related('student')

    data = []

    for record in attendance_records:

        data.append({
            'student_id': record.student.id,
            'status': record.status
        })

    return JsonResponse({
        'attendance': data
    })
def my_attendance_summary(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    if request.user.role != 'student':
        return JsonResponse(
            {'error': 'Only students can view attendance'},
            status=403
        )

    records = Attendance.objects.filter(
        student=request.user
    ).select_related('subject')

    subjects = {}
    total_classes = 0
    total_present = 0

    for record in records:

        subject_name = record.subject.subject_name

        if subject_name not in subjects:
            subjects[subject_name] = {
                'subject': subject_name,
                'total': 0,
                'present': 0,
                'absent': 0
            }

        subjects[subject_name]['total'] += 1
        total_classes += 1

        if record.status == 'present':
            subjects[subject_name]['present'] += 1
            total_present += 1
        else:
            subjects[subject_name]['absent'] += 1

    for subject in subjects.values():

        if subject['total'] > 0:
            subject['percentage'] = round(
                (subject['present'] / subject['total']) * 100,
                2
            )
        else:
            subject['percentage'] = 0

    overall_percentage = 0

    if total_classes > 0:
        overall_percentage = round(
            (total_present / total_classes) * 100,2
        )

    return JsonResponse({
        'attendance': list(subjects.values()),
        'overall': {
            'total': total_classes,
            'present': total_present,
            'absent': total_classes - total_present,
            'percentage': overall_percentage
        }
    })
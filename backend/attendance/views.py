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
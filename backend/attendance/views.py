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
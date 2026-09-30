from django.contrib import admin
from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):

    list_display = (
        'student',
        'subject',
        'total_classes',
        'present_classes',
        'percentage',
    )

    list_filter = (
        'subject',
    )

    search_fields = (
        'student__username',
        'student__student_id',
    )
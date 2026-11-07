from django.contrib import admin
from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):

    list_display = (
        'student',
        'subject',
        'date',
        'class_number',
        'status',
    )

    list_filter = (
        'subject',
        'date',
        
        'status',
    )

    search_fields = (
        'student__username',
        'student__student_id',
        'student__temporary_id',
        'subject__subject_name',
    )
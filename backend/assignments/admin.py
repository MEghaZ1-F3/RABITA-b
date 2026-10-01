from django.contrib import admin
from .models import Assignment


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):

    list_display = (
        'student',
        'subject',
        'title',
        'due_date',
        'submitted',
    )

    list_filter = (
        'subject',
        'submitted',
        'due_date',
    )

    search_fields = (
        'student__username',
        'student__student_id',
        'title',
    )

from .models import AssignmentSubmission

@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):

    list_display = (
        'student',
        'assignment',
        'status',
        'submitted_at',
    )

    list_filter = (
        'status',
        'submitted_at',
    )

    search_fields = (
        'student__username',
        'assignment__title',
    )
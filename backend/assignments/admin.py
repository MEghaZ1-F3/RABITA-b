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
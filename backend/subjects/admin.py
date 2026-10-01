from django.contrib import admin
from .models import Subject


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):

    list_display = (
        'subject_name',
        'branch',
        'semester',
        'faculty',
    )

    list_filter = (
        'branch',
        'semester',
        'faculty',
    )

    search_fields = (
        'subject_name',
    )
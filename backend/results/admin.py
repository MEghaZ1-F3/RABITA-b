from django.contrib import admin
from .models import Result


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):

    list_display = (
        'student',
        'subject',
        'marks',
        'max_marks',
        'grade',
        'semester',
    )

    list_filter = (
        'semester',
        'subject',
    )

    search_fields = (
        'student__username',
        'student__student_id',
        'subject',
    )
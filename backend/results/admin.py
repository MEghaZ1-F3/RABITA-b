from django.contrib import admin
from .models import Result
from .models import InternalMarks



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

@admin.register(InternalMarks)
class InternalMarksAdmin(admin.ModelAdmin):

    list_display = (
        'student',
        'subject',
        'semester',
        'ct1_marks',
        'ct2_marks',
    )

    list_filter = (
        'semester',
        'subject',
    )

    search_fields = (
        'student__username',
        'student__student_id',
    )
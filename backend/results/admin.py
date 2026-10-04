from django.contrib import admin
from .models import Result
from .models import InternalMarks, SemesterResult



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
@admin.register(SemesterResult)
class SemesterResultAdmin(admin.ModelAdmin):
    list_display = (
        'student',
        'semester',
        'status',
        'uploaded_at'
    )

    list_filter = (
        'semester',
        'status'
    )

    search_fields = (
        'student__username',
        'student__student_id'
    )
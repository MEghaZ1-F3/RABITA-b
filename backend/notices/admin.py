from django.contrib import admin
from .models import Notice


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):

    list_display = (
        'title',
        'posted_date',
        'important',
    )

    list_filter = (
        'important',
        'posted_date',
    )

    search_fields = (
        'title',
        'message',
    )
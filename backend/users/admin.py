from django.contrib import admin
from django.utils.html import format_html
from django.contrib.auth.admin import UserAdmin

from .models import User
from .forms import CustomUserCreationForm


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    class Media:
        js = ('users/js/user_admin.js',)

    add_form = CustomUserCreationForm

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username',
                'password1',
                'password2',
                'role',
                'faculty_type',
                'is_hod',
                'branch',
                'entry_type',
                'semester',
                'admission_year',
                'enrollment_number',
            ),
        }),
    )

    fieldsets = UserAdmin.fieldsets + (
        ('College Information', {
            'fields': (
                'role',
                'faculty_type',
                'is_hod',
                'branch',
                'entry_type',
                'semester',
                'admission_year',
                'temporary_id',
                'enrollment_number',
                'student_id',
                'approval_status',
            ),
        }),
    )

    list_display = (
        'username',
        'role',
        'faculty_type',
        'branch',
        'semester',
        'entry_type',
        'student_id',
        'temporary_id',
        'approval_status',
    )

    list_filter = (
        'role',
        'faculty_type',
        'branch',
        'semester',
        'entry_type',
        'approval_status',
    )

    search_fields = (
        'username',
        'student_id',
        'temporary_id',
        'enrollment_number',
    )
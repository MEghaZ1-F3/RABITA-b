from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User
from .forms import CustomUserCreationForm


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    add_form = CustomUserCreationForm

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username',
                'password1',
                'password2',
                'role',
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
        'branch',
        'semester',
        'entry_type',
        'student_id',
        'temporary_id',
        'approval_status',
    )

    list_filter = (
        'role',
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
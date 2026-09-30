from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User


class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = User
        fields = (
            'username',
            'role',
            'branch',
            'entry_type',
            'semester',
            'admission_year',
            'enrollment_number',
        )

    def clean(self):
        cleaned_data = super().clean()

        role = cleaned_data.get('role')
        branch = cleaned_data.get('branch')

        if role == 'faculty' and not branch:
            self.add_error(
                'branch',
                'Branch is required for Faculty.'
            )

        return cleaned_data
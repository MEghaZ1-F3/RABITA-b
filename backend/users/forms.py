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


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['semester'].choices = [('', '---------')] + [
            (i, i) for i in range(1, 9)
        ]

        entry_type = (
            self.data.get('entry_type')
            or self.initial.get('entry_type')
        )

        if entry_type == 'lateral':
            self.fields['semester'].choices = [('', '---------')] + [
                (i, i) for i in range(3, 9)
            ]


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
from django.db import models
from users.models import User


class Subject(models.Model):

    BRANCH_CHOICES = (
        ('CSE', 'Computer Science Engineering'),
        ('MIN', 'Mining Engineering'),
        ('ME', 'Mechanical Engineering'),
        ('EE', 'Electrical Engineering'),
        ('CE', 'Civil Engineering'),
    )

    branch = models.CharField(
        max_length=10,
        choices=BRANCH_CHOICES
    )

    semester = models.PositiveIntegerField(
        choices=[
            (1, '1st Semester'),
            (2, '2nd Semester'),
            (3, '3rd Semester'),
            (4, '4th Semester'),
            (5, '5th Semester'),
            (6, '6th Semester'),
            (7, '7th Semester'),
            (8, '8th Semester'),
        ]
    )

    subject_name = models.CharField(max_length=100)

    faculty = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'faculty'}
    )

    def __str__(self):
        return f"{self.subject_name} - {self.branch} - Semester {self.semester}"
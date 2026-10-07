from django.db import models
from users.models import User
from subjects.models import Subject


class Attendance(models.Model):

    STATUS_CHOICES = (
        ('present', 'Present'),
        ('absent', 'Absent'),
    )

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )

    date = models.DateField()

    class_number = models.PositiveIntegerField()

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    'student',
                    'subject',
                    'date',
                    'class_number'
                ],
                name='unique_student_subject_date_class'
            )
        ]

    def __str__(self):
        return (
            f"{self.student.username} - "
            f"{self.subject.subject_name} - "
            f"{self.date} - "
            f"Class {self.class_number}"
        )
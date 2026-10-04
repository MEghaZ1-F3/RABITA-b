from django.db import models
from users.models import User
from subjects.models import Subject
from django.core.validators import MaxValueValidator


class Result(models.Model):

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    subject = models.CharField(max_length=100)

    marks = models.PositiveIntegerField()

    max_marks = models.PositiveIntegerField(default=100)

    grade = models.CharField(max_length=5)

    semester = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.student.username} - {self.subject}"

class InternalMarks(models.Model):

    student = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    semester = models.PositiveIntegerField()

    ct1_marks = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(20)]
    )

    ct2_marks = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(20)]
    )

    def __str__(self):
        return f"{self.student.username} - {self.subject.subject_name}"
class SemesterResult(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    semester = models.PositiveIntegerField()

    result_file = models.FileField(
        upload_to='results/'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    faculty_remarks = models.TextField(
        blank=True
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.student.username} - Semester {self.semester}"
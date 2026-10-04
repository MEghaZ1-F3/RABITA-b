from django.db import models
from users.models import User
from subjects.models import Subject


class Assignment(models.Model):

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    subject = models.CharField(max_length=100)

    subject_ref = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    title = models.CharField(max_length=200)

    description = models.TextField(blank=True)

    due_date = models.DateField()

    submitted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.username} - {self.title}"

class AssignmentSubmission(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE
    )

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    soft_copy = models.FileField(
        upload_to='assignments/submissions/'
    )

    submitted_at = models.DateTimeField(
        auto_now_add=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    hard_copy_received = models.BooleanField(default=False)

    professor_remarks = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"{self.student.username} - {self.assignment.title}"
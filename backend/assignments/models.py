from django.db import models
from users.models import User


class Assignment(models.Model):

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    subject = models.CharField(max_length=100)

    title = models.CharField(max_length=200)

    description = models.TextField(blank=True)

    due_date = models.DateField()

    submitted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.username} - {self.title}"
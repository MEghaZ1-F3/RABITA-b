from django.db import models
from users.models import User


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
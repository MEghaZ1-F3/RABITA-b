from django.db import models
from users.models import User


class Attendance(models.Model):

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    subject = models.CharField(max_length=100)

    total_classes = models.PositiveIntegerField(default=0)

    present_classes = models.PositiveIntegerField(default=0)

    @property
    def percentage(self):
        if self.total_classes == 0:
            return 0

        return round(
            (self.present_classes / self.total_classes) * 100,
            2
        )

    def __str__(self):
        return f"{self.student.username} - {self.subject}"
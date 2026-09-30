from django.db import models


class Notice(models.Model):

    title = models.CharField(max_length=200)

    message = models.TextField()

    posted_date = models.DateTimeField(auto_now_add=True)

    important = models.BooleanField(default=False)

    def __str__(self):
        return self.title
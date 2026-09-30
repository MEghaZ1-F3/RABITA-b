from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = (
        ('principal', 'Principal'),
        ('faculty', 'Faculty'),
        ('student', 'Student'),
    )

    BRANCH_CHOICES = (
        ('CSE', 'Computer Science Engineering'),
        ('MIN', 'Mining Engineering'),
        ('ME', 'Mechanical Engineering'),
        ('EE', 'Electrical Engineering'),
        ('CE', 'Civil Engineering'),
    )

    ENTRY_TYPE_CHOICES = (
        ('regular', 'Regular'),
        ('lateral', 'Lateral Entry'),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='student'
    )

    branch = models.CharField(
        max_length=10,
        choices=BRANCH_CHOICES,
        blank=True,
        null=True
    )

    entry_type = models.CharField(
        max_length=20,
        choices=ENTRY_TYPE_CHOICES,
        blank=True,
        null=True
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
        ],
        blank=True,
        null=True
    )
    admission_year = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    temporary_id = models.CharField(
        max_length=30,
        unique=True,
        blank=True,
        null=True
    )

    enrollment_number = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        null=True
    )

    student_id = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        null=True
    )

    approval_status = models.CharField(
        max_length=20,
        choices=(
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected'),
        ),
        default='pending'
    )



    def clean(self):
        from django.core.exceptions import ValidationError

        if self.role == 'student':

            # Regular 1st semester ke liye 
            if self.entry_type == 'regular' and self.semester == 1:
                pass

            # Lateral 3rd semester ke liye
            elif self.entry_type == 'lateral' and self.semester == 3:
                pass

            # Baaki semesters me enrollment dena padega
            elif not self.enrollment_number:
                raise ValidationError(
                    "Enrollment number is required for this semester."
                )



    def save(self, *args, **kwargs):

        if self.role == 'student':

           
            # Prefix hai
           
            if self.entry_type == 'regular':
                prefix = 'MZ'
            else:
                prefix = 'MT'

            year = str(self.admission_year)[-2:]

           
            # Final Student ID hai
           
            if self.enrollment_number:

                self.student_id = (
                    f"{prefix}-{self.enrollment_number}-{self.branch}-{year}"
                )

                # Temporary ID no longer needed
                self.temporary_id = None

           
            # Temporary ID hai
          
            elif not self.temporary_id:

                # Temporary ID only for:
                # Regular 1st semester
                # Lateral 3rd semester

                if (
                    self.entry_type == 'regular'
                    and self.semester == 1
                ) or (
                    self.entry_type == 'lateral'
                    and self.semester == 3
                ):

                    last_number = 0

                    existing_students = User.objects.filter(
                        role='student',
                        temporary_id__startswith=f"{prefix}-"
                    )

                    for student in existing_students:
                        try:
                            number = int(
                                student.temporary_id.split('-')[1]
                            )

                            if number > last_number:
                                last_number = number

                        except (ValueError, IndexError):
                            pass

                    next_number = last_number + 1

                    self.temporary_id = (
                        f"{prefix}-{next_number:03d}-{self.branch}-{year}"
                    )

        super().save(*args, **kwargs)
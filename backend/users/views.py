from django.http import JsonResponse
from .models import User


from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
import json
@csrf_exempt
def login_view(request):

    if request.method != 'POST':
        return JsonResponse(
            {'error': 'POST method required'},
            status=405
        )

    data = json.loads(request.body)

    username = data.get('username')
    password = data.get('password')

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is None:
        return JsonResponse(
            {'error': 'Invalid username or password'},
            status=401
        )

    login(request, user)

    return JsonResponse({
        'message': 'Login successful',
        'role': user.role,
        'username': user.username
    })
def student_list(request):

    # User login nahi hai
    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    # Faculty h
    if request.user.role == 'faculty':

        students = User.objects.filter(
            role='student',
            branch=request.user.branch
        )

    # Principal h
    elif request.user.role == 'principal':

        students = User.objects.filter(
            role='student'
        )

    # Student ya koi other role h
    else:

        return JsonResponse(
            {'error': 'Access denied'},
            status=403
        )

    data = []

    for student in students:

        data.append({
            'id': student.id,
            'name': student.username,
            'student_id': student.student_id,
            'temporary_id': student.temporary_id,
            'branch': student.branch,
            'semester': student.semester,
            'entry_type': student.entry_type,
            'admission_year': student.admission_year,
            'enrollment_number': student.enrollment_number,
            'approval_status': student.approval_status,
        })

    return JsonResponse(data, safe=False)
def logout_view(request):

    logout(request)

    return JsonResponse({
        'message': 'Logout successful'
    })
def me_view(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    user = request.user

    return JsonResponse({
        'id': user.id,
        'username': user.username,
        'role': user.role,
        'student_id': user.student_id,
        'temporary_id': user.temporary_id,
        'branch': user.branch,
        'semester': user.semester,
        'entry_type': user.entry_type,
        'admission_year': user.admission_year,
        'enrollment_number': user.enrollment_number,
        'approval_status': user.approval_status,
    })
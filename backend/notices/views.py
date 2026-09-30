from django.http import JsonResponse
from .models import Notice


def notice_list(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {'error': 'Login required'},
            status=401
        )

    notices = Notice.objects.all().order_by('-posted_date')

    data = []

    for notice in notices:
        data.append({
            'title': notice.title,
            'message': notice.message,
            'posted_date': notice.posted_date.strftime('%d-%m-%Y'),
            'important': notice.important,
        })

    return JsonResponse({
        'notices': data
    })
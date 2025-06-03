from django.shortcuts import render, redirect, get_object_or_404
from django.http import Http404, HttpResponseForbidden
from django.db import connection, IntegrityError, transaction
from django.contrib import messages
from django.contrib.auth import login
from .forms import UserRegisterForm

from .models import Service, Application, ApplicationService

from django.db import connection
from django.shortcuts import render, redirect

from django.views.decorators.cache import cache_page

# ───────── главное меню ─────────
@cache_page(60 * 15)  # Кэшировать на 15 минут
def menu(request):
    return render(request, 'services/menu.html')

# ───────── список услуг ─────────
def index(request):
    q = request.GET.get('q', '').strip().lower()
    services = Service.objects.filter(status='active')
    if q:
        services = services.filter(name__icontains=q)
    # minio_endpoint = "localhost:9000"
    # bucket_name = os.environ.get("MINIO_BUCKET_NAME", "default-bucket")
    return render(request, 'services/index.html',
                  {'services': services, 'query': q,
                    # 'minio_endpoint': minio_endpoint,
                    # 'bucket_name': bucket_name
                    })


# ───────── детали ─────────
def detail(request, slug):
    service = get_object_or_404(Service, slug=slug, status='active')
    # minio_endpoint = "localhost:9000"
    # bucket_name = os.environ.get("MINIO_BUCKET_NAME", "default-bucket")
    return render(request, 'services/detail.html',
                  {'service': service,
                    # 'minio_endpoint': minio_endpoint,
                    # 'bucket_name': bucket_name
                   })


# ───────── soft-delete через raw SQL ─────────
def soft_delete(request, slug):
    if not request.user.is_staff:
        return HttpResponseForbidden('Только администратор может удалять')

    with connection.cursor() as cur:
        cur.execute("UPDATE services_service SET status='deleted' WHERE slug=%s", [slug])
    messages.success(request, 'Услуга помечена как удалённая')
    return redirect('services_list')


# ───────── POST: отправить уведомление ─────────
def notify(request, slug):
    """Создаёт заявку и связь «заявка-услуга».
       Доступно только аутентифицированным пользователям."""
    if request.method != 'POST':
        raise Http404()

    if not request.user.is_authenticated:
        messages.error(request, 'Сначала войдите в систему')
        return redirect('service_detail', slug=slug)

    service = get_object_or_404(Service, slug=slug, status='active')

    # в одной транзакции: заявка (draft) + связь
    try:
        with transaction.atomic():
            app, _ = Application.objects.get_or_create(
                status='draft', requester=request.user, moderator=None)
            ApplicationService.objects.get_or_create(
                application=app, service=service)
    except IntegrityError:
        messages.warning(request, 'Услуга уже добавлена в вашу заявку')
    else:
        messages.success(request, 'Услуга добавлена в заявку-черновик')

    return redirect('services_list')

def register(request):
    """Регистрация обычного пользователя."""
    if request.user.is_authenticated:
        return redirect('services_list')

    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)                       # авторизуем сразу
            messages.success(request, 'Вы успешно зарегистрированы')
            return redirect('services_list')
    else:
        form = UserRegisterForm()

    return render(request, 'registration/register.html', {'form': form})

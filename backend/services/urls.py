from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from . import views        # HTML‑контроллеры

urlpatterns = [
    # ── HTML‑часть (Lab 1 + 2) ────────────────────────────────
    path('',                           views.menu,        name='menu'),
    path('services/',                  views.index,       name='services_list'),
    path('service/<slug:slug>/',       views.detail,      name='service_detail'),
    path('service/<slug:slug>/delete/',views.soft_delete, name='service_delete'),
    path('service/<slug:slug>/notify/',views.notify,      name='service_notify'),

    # регистрация через форму (Lab 2)
    path('accounts/register/',         views.register,    name='register'),

    # ── REST‑API (Lab 3) ─────────────────────────────────────
    path('api/', include('services.api_urls')),
]

# отдача медиа‑файлов в режиме DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Swagger
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from rest_framework.authentication import TokenAuthentication

schema_view = get_schema_view(
    openapi.Info(
        title="SPA Backend API",
        default_version='v1',
        description="Авторизация, услуги и заявки",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes=(TokenAuthentication,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('services.api_urls')),

    # Swagger и Redoc
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/',    schema_view.with_ui('swagger',  cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/',      schema_view.with_ui('redoc',    cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

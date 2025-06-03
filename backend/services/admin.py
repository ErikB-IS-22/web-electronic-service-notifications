from django.contrib import admin
from .models import Service, Application, ApplicationService


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'status')
    list_filter  = ('status',)
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display  = ('id', 'status', 'created_at', 'requester', 'moderator')
    list_filter   = ('status', 'created_at')
    raw_id_fields = ('requester', 'moderator')


admin.site.register(ApplicationService)

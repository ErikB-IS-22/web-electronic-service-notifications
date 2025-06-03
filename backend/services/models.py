from django.db import models
from django.contrib.auth import get_user_model

from django.db.models.signals import post_save
from django.dispatch import receiver
from minio import Minio
from minio.error import S3Error
import os

User = get_user_model()

# ───── Услуги ────────────────────────────────────────────────
class Service(models.Model):
    STATUS = [('active', 'Действует'), ('deleted', 'Удалён')]

    slug        = models.SlugField(max_length=60, unique=True)
    name        = models.CharField(max_length=120)
    description = models.TextField()
    image       = models.ImageField(upload_to='services/', blank=True)
    status      = models.CharField(max_length=7, choices=STATUS, default='active')

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'

    def __str__(self):
        return self.name


@receiver(post_save, sender=Service)
def upload_to_minio(sender, instance, **kwargs):
    minio_client = Minio(
        "minio:9000",
        access_key="minio",
        secret_key="minio123",
        secure=False
    )

    bucket_name = "images"
    file_path = instance.image.path
    object_name = f"services/services/{os.path.basename(file_path)}"

    try:
        minio_client.fput_object(
            bucket_name, object_name, file_path
        )
    except S3Error as exc:
        print("Error uploading to Minio:", exc)


# ───── Заявки ────────────────────────────────────────────────
class Application(models.Model):
    STATUSES = [
        ('draft',    'Черновик'),
        ('deleted',  'Удалена'),
        ('formed',   'Сформирована'),
        ('finished', 'Завершена'),
        ('rejected', 'Отклонена'),
    ]

    status      = models.CharField(max_length=8, choices=STATUSES, default='draft')
    created_at  = models.DateTimeField(auto_now_add=True)
    formed_at   = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    requester   = models.ForeignKey(
        User, related_name='created_apps', on_delete=models.CASCADE
    )
    moderator   = models.ForeignKey(
        User, related_name='moderated_apps',
        null=True, blank=True, on_delete=models.SET_NULL
    )

    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'

    def __str__(self):
        return f'Заявка #{self.pk} ({self.get_status_display()})'


# ───── m‑n: «Услуга в заявке» ───────────────────────────────
class ApplicationService(models.Model):
    application = models.ForeignKey(
        Application,
        related_name='items',          # ← важно! теперь app.items.all()
        on_delete=models.CASCADE,
    )
    service     = models.ForeignKey(Service, on_delete=models.CASCADE)
    quantity    = models.PositiveIntegerField(default=1)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['application', 'service'],
                name='uniq_application_service',
            )
        ]
        verbose_name = 'Услуга в заявке'
        verbose_name_plural = 'Услуги в заявках'

    def __str__(self):
        return f'{self.application} → {self.service} ×{self.quantity}'

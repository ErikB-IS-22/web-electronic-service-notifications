from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Service, Application, ApplicationService

User = get_user_model()

# ───── Регистрация пользователя ─────────────────────────────
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ('id', 'username', 'password')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


# ───── Услуга ───────────────────────────────────────────────
class ServiceSer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model  = Service
        fields = ('id', 'slug', 'name', 'description', 'image', 'status')
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True}
        }

    def get_image(self, obj):
        return obj.image.url if obj.image else None


# ───── Услуга в заявке (read) ───────────────────────────────
class ApplicationServiceSer(serializers.ModelSerializer):
    service  = ServiceSer(read_only=True)
    quantity = serializers.IntegerField()

    class Meta:
        model = ApplicationService
        fields = ('service', 'quantity')


# ───── Услуга в заявке (write) ──────────────────────────────
class AppServiceWriteSer(serializers.Serializer):
    service  = serializers.IntegerField()           # id услуги
    quantity = serializers.IntegerField(min_value=1)


# ───── Заявка ───────────────────────────────────────────────
class ApplicationSer(serializers.ModelSerializer):
    requester = serializers.SlugRelatedField(slug_field='username', read_only=True)
    moderator = serializers.SlugRelatedField(slug_field='username', read_only=True)
    services  = ApplicationServiceSer(source='items', many=True, read_only=True)

    class Meta:
        model  = Application
        fields = (
            'id', 'status', 'created_at', 'formed_at', 'finished_at',
            'requester', 'moderator', 'services',
        )

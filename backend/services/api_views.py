from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.contrib.auth import get_user_model, authenticate, login, logout

from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import Service, Application, ApplicationService
from .serializers import (
    UserSerializer, ServiceSer, ApplicationSer, AppServiceWriteSer,
)
from .permissions import IsRequesterOrAdmin

from rest_framework.parsers import MultiPartParser, FormParser


User = get_user_model()

# ─────────── REG / LOGIN ────────────
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = UserSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=400)
        user = ser.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"id": user.id, "username": user.username, "token": token.key},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = authenticate(
            request,
            username=request.data.get("username"),
            password=request.data.get("password"),
        )
        if not user:
            return Response({"detail": "Неверные логин/пароль"}, status=401)
        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"id": user.id, "username": user.username, "token": token.key})


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
        return Response({"detail": "OK"})


# ─────────── SERVICES ────────────
class ServiceList(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        qs = super().get_queryset().filter(status="active")
        q = self.request.query_params.get("q")
        return qs.filter(name__icontains=q) if q else qs

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        draft_id = None
        if request.user.is_authenticated:
            draft = Application.objects.filter(
                requester=request.user, status="draft"
            ).first()
            draft_id = draft.id if draft else None
        return Response({"draft_id": draft_id, "services": response.data})

class AppItemsView(APIView):
    permission_classes = [IsRequesterOrAdmin]

    def post(self, request, id):
        app = get_object_or_404(Application, pk=id, status='draft')
        self.check_object_permissions(request, app)

        ser = AppServiceWriteSer(data=request.data, many=True)
        ser.is_valid(raise_exception=True)

        # чистим то, что было, чтобы не дублировать
        app.items.all().delete()

        bulk = [
            ApplicationService(
                application=app,
                service_id=item['service'],
                quantity=item['quantity'],
            )
            for item in ser.validated_data
        ]
        ApplicationService.objects.bulk_create(bulk)

        return Response({'added': len(bulk)})

class ServiceDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = "id"
    queryset = Service.objects.all()
    serializer_class = ServiceSer

    def get_permissions(self):
        if self.request.method in ("PUT", "PATCH", "DELETE"):
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


# ─────────── APPLICATIONS ────────────
class AppList(generics.ListCreateAPIView):
    serializer_class = ApplicationSer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Application.objects.exclude(status__in=("deleted", "draft"))
        return qs if self.request.user.is_staff else qs.filter(requester=self.request.user)

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)


class AppDetail(generics.RetrieveAPIView):
    lookup_field = "id"
    queryset = Application.objects.all()
    serializer_class = ApplicationSer
    permission_classes = [permissions.IsAuthenticated]


class AppFormView(APIView):
    permission_classes = [IsRequesterOrAdmin]   # ← заменили

    def put(self, request, id):
        app = get_object_or_404(Application, pk=id, status="draft")
        self.check_object_permissions(request, app)   # проверяем доступ

        app.status = "formed"
        app.formed_at = timezone.now()
        app.save(update_fields=["status", "formed_at"])
        return Response({"status": app.status})


class AppFinishView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, id):
        app = get_object_or_404(Application, pk=id, status="formed")
        ok = request.query_params.get("ok") == "1"
        app.status = "finished" if ok else "rejected"
        app.moderator_id = settings.TEST_MODERATOR_ID
        app.finished_at = timezone.now()
        app.save(update_fields=["status", "moderator", "finished_at"])
        return Response({"status": app.status})


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "is_staff": request.user.is_staff,
            }
        )

class DraftView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        app = Application.objects.filter(
            requester=request.user, status='draft'
        ).first()
        if not app:
            return Response({'items': [], 'draftId': None})

        data = {
            'draftId': app.id,
            'items': [
                {
                    'id'      : item.id,
                    'quantity': item.quantity,
                    'service' : {
                        'id'  : item.service.id,
                        'name': item.service.name,
                    },
                }
                for item in app.items.all()           # ← работает
            ]
        }
        return Response(data)


# services/permissions.py
from rest_framework import permissions

class IsRequesterOrAdmin(permissions.BasePermission):
    """
    PUT /applications/<id>/form/ доступно
    • админу
    • или автору заявки‑черновика
    """
    def has_object_permission(self, request, view, obj):
        return bool(
            request.user
            and (
                request.user.is_staff       # админ
                or obj.requester == request.user  # владелец черновика
            )
        )

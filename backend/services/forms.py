from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

User = get_user_model()


class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(required=False, label='E‑mail (необязательно)')

    class Meta:
        model  = User
        fields = ("username", "email")          # парольные поля добавляет базовый класс

    def save(self, commit=True):
        user = super().save(commit=False)
        user.is_staff = False                   # обычный пользователь
        if commit:
            user.save()
        return user


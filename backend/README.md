# Проект Django + React

## Описание
Этот проект состоит из двух основных частей:
1. **Backend** на Django (с использованием Django REST Framework).
2. **Frontend** на React, который взаимодействует с бэкендом через API.

## Требования
- Python 3.8+
- Node.js (для фронтенда)
- Docker (для развёртывания)

## Установка и настройка

- docker compose up -d --build

- docker compose exec web bash

- python manage.py makemigrations
- python manage.py migrate

Для изначальных данных:
- python import_services.py

- docker compose exec web python manage.py makemigrations
- docker compose exec web python manage.py migrate

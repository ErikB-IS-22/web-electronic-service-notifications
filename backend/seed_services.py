from services.models import Service
from django.utils.text import slugify

# Удаляем все предыдущие записи
Service.objects.all().delete()

data = [
    {
        "name": "Галерея современного искусства",
        "description": "Уведомления о принятии работ на выставку, сроках проведения мероприятий и изменениях в расписании.",
        "image": "services/id1.png",
    },
    {
        "name": "Онлайн‑платформа для художников",
        "description": "Уведомления о новых заказах, отзывах на работы, а также о предстоящих конкурсах и акциях.",
        "image": "services/id2.png",
    },
    {
        "name": "Магазин художественных материалов",
        "description": "Уведомления о поступлении новых товаров, скидках и акциях на краски, холсты и другие материалы.",
        "image": "services/id3.png",
    },
    {
        "name": "Фонд поддержки молодых художников",
        "description": "Уведомления о грантах, стипендиях и возможностях участия в программах поддержки.",
        "image": "services/id4.png",
    },
    {
        "name": "Школа искусств",
        "description": "Уведомления о расписании занятий, мастер‑классах и изменениях в программе обучения.",
        "image": "services/id5.png",
    },
    {
        "name": "Арт‑фестиваль",
        "description": "Уведомления о датах проведения, условиях участия и результатах отбора работ.",
        "image": "services/id6.png",
    },
    {
        "name": "Печатная мастерская",
        "description": "Уведомления о готовности заказов на печать постеров, открыток и других изделий.",
        "image": "services/id7.png",
    },
    {
        "name": "Музей изобразительных искусств",
        "description": "Уведомления о выставках, экскурсиях и работе в творческой резиденции.",
        "image": "services/id8.png",
    },
]

for i, item in enumerate(data):
    slug = slugify(item['name']) or f"service-{i}"
    Service.objects.create(
        slug=slug,
        name=item['name'],
        description=item['description'],
        image=item['image'],
        status='active',
    )

print("✓ занесено", len(data), "услуг")

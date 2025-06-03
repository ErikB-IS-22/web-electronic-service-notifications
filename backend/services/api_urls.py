from django.urls import path
from . import api_views as v

urlpatterns = [
    # аутентификация
    path('auth/register/', v.RegisterView.as_view(), name='auth-register'),
    path('auth/login/',    v.LoginView.as_view(),    name='auth-login'),
    path('auth/logout/',   v.LogoutView.as_view(),   name='auth-logout'),
    path('auth/profile/',  v.ProfileView.as_view()),

    # услуги (все могут читать, модератор ещё может править)
    path('services/',           v.ServiceList.as_view(),   name='service-list'),
    path('services/<int:id>/',  v.ServiceDetail.as_view(), name='service-detail'),

    # заявки
    path('applications/',            v.AppList.as_view(),   name='app-list'),
    path('applications/<int:id>/',   v.AppDetail.as_view(), name='app-detail'),
    path('applications/<int:id>/form/',   v.AppFormView.as_view(),   name='app-form'),
    path('applications/<int:id>/finish/', v.AppFinishView.as_view(), name='app-finish'),
    path('draft/', v.DraftView.as_view(), name='draft'),
    path('applications/<int:id>/items/', v.AppItemsView.as_view()),
]

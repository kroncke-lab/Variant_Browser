from django.urls import path
from . import views

app_name = 'kcnh2'
urlpatterns = [
    path('', views.penetrance_estimation, name='penetrance_estimate'),
    path('about/', views.about, name='about'),
    path('main/', views.display, name='main'),
    path('variantinfo/<str:hgvsc>', views.variantview, name='detail'),
]

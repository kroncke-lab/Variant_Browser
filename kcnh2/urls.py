from django.urls import path
from kcnh2 import views

app_name = 'kcnh2'
urlpatterns = [
    path('', views.display, name='main'),
    path('variantinfo/<str:hgvsc>', views.variantview, name='detail'),
]

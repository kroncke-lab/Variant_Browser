from django.urls import path
from ryr2 import views

app_name = 'ryr2'
urlpatterns = [
    path('', views.display, name='main'),
    path('variantinfo/<str:hgvsc>', views.variantview, name='detail'),
]


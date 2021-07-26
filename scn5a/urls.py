from django.urls import path
from . import views

app_name = 'scn5a'
urlpatterns = [
    path('', views.display, name='main'),
    path('variantinfo/<str:hgvsc>', views.variantview, name='detail'),
]

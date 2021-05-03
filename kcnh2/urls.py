from django.urls import path
from . import views

app_name = 'kcnh2'
urlpatterns = [
    path('penetrance_estimate_protocol', views.penetrance_estimation, name='penetrance_estimate'),
    path('about/', views.about, name='about'),
    path('', views.display, name='main'),
    path('variantinfo/<str:hgvsc>', views.variantview, name='detail'),
]

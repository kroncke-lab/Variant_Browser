from django.urls import path
from kcnq1 import views, api

app_name = 'kcnq1'
urlpatterns = [
    path('', views.display, name='main'),
    path('variantinfo/<str:hgvsc>', views.variantview, name='detail'),
    path('api/variants/', api.datatables_api, name='api_variants'),
]

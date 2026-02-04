from django.urls import path
from scn5a.views import display, variantview
from scn5a import api

app_name = 'scn5a'
urlpatterns = [
    path('', display, name='main'),
    path('variantinfo/<str:hgvsc>', variantview, name='detail'),
    path('api/variants/', api.datatables_api, name='api_variants'),
]

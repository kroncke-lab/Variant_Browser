from django.urls import path
from scn5a.views import display, variantview

app_name = 'scn5a'
urlpatterns = [
    path('', display, name='main'),
    path('variantinfo/<str:hgvsc>', variantview, name='detail'),
]

"""variantbrowser URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/


TODO add SCN5A url and all subsequently necessary files to run variant browser site

"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('KCNH2/', include('kcnh2.urls')),
    path('SCN5A/', include('scn5a.urls')),
    path('', views.home, name='home'),
    path('penetrance_estimate_protocol', views.penetrance_estimation, name='penetrance_estimate'),
    path('penetrance_estimate_protocol_details', views.penetrance_estimation_first_SCN5A, name='penetrance_estimate_details'),
    path('about/', views.about, name='about'),
]


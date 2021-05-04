import math

from django.shortcuts import render
from django.views import generic
from kcnh2.models import newVariant, ClinicalPapers, kcnh2Distances, FunctionalPapers


# Create your views here.


def home(request):
    return render(request, 'home.html')


def about(request):
    return render(request, 'about.html')


def penetrance_estimation(request):
    return render(request, 'penetrance_estimate.html')

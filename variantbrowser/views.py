import math

from django.shortcuts import render
from django.views import generic
from kcnh2.models import newVariant, ClinicalPapers, kcnh2Distances, FunctionalPapers

# Create your views here.


def home(request):
    return render(request, 'home.html')


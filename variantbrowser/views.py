import math

from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'home.html')


def about(request):
    return render(request, 'about.html')


def penetrance_estimation(request):
    return render(request, 'penetrance_estimate.html')


def penetrance_estimation_first_SCN5A(request):
    return render(request, 'penetrance_protocol_first_SCN5A.html')

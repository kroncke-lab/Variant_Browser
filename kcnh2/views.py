import math

from django.shortcuts import render
from django.views import generic
from kcnh2.models import newVariant, ClinicalPapers, kcnh2Distances, FunctionalPapers

# Create your views here.


def about(request):
    return render(request, 'about.html')


def penetrance_estimation(request):
    return render(request, 'penetrance_estimate.html')


def display(request):
    recs = newVariant.objects.all()
    return render(request, 'main.html', {'recs': recs})


def variantview(request, hgvsc):
    resnum = newVariant.objects.filter(hgvsc=hgvsc).values_list('resnum', flat=True)
    var = newVariant.objects.filter(hgvsc=hgvsc).values_list('var', flat=True)
    recs_dists = kcnh2Distances.objects.filter(resnum=int(resnum[0]), distance__lt=15)
    neighbors = kcnh2Distances.objects.filter(resnum=int(resnum[0])).values_list('neighbor', flat=True)
    recs_funcs = FunctionalPapers.objects.filter(variant=var[0])
    recs_clin = ClinicalPapers.objects.filter(variant=var[0])
    recs_vars = set(newVariant.objects.filter(resnum__in=neighbors, lqt2__gt=0) | \
                newVariant.objects.filter(resnum__in=neighbors, unaff__gt=0))
    variant = newVariant.objects.get(hgvsc=hgvsc)
    total_carriers = variant.lqt2 + variant.unaff
    if variant.mutAA == "X" or variant.mutAA == "fsX":
        var_type = False
    else:
        var_type = True
    try:
        alpha = math.floor(float(variant.alpha))
        beta = 10-alpha
    except ValueError and TypeError:
        alpha = "NA"
        beta = "NA"
    return render(request, 'detail.html', {'recs_dists': recs_dists, 'recs_funcs': recs_funcs,
                                           'recs_clin': recs_clin, 'var': var, 'recs_vars': recs_vars,
                                           'variant': variant, 'total_carriers': total_carriers, 'alpha': alpha,
                                           'beta': beta, 'clin_papers': len(recs_clin), 'func_papers': len(recs_funcs),
                                           'var_type': var_type})
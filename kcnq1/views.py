import math
from django.shortcuts import render
from django.views.decorators.cache import cache_page
from kcnq1.models import KCNQ1NewVariant, KCNQ1ClinicalPapers, kcnq1Distances, KCNQ1FunctionalPapers, KCNQ1InSilico


# Create your views here.
# thirty days 86400 * 30
@cache_page(60*60*31)
def display(request):
    recs = KCNQ1NewVariant.objects.all()
    ret = render(request, 'kcnq1/main.html', {'recs': recs})
    return ret


@cache_page(60*60*31)
def variantview(request, hgvsc):
    resnum = KCNQ1NewVariant.objects.filter(hgvsc=hgvsc).values_list('resnum', flat=True)
    var = KCNQ1NewVariant.objects.filter(hgvsc=hgvsc).values_list('var', flat=True)
    recs_dists = kcnq1Distances.objects.filter(resnum=int(resnum[0]), distance__lt=15)
    neighbors = kcnq1Distances.objects.filter(resnum=int(resnum[0])).values_list('neighbor', flat=True)
    recs_funcs = KCNQ1FunctionalPapers.objects.filter(var=var[0])
    recs_clin = KCNQ1ClinicalPapers.objects.filter(var=var[0], pmid__isnull=False)
    recs_vars = KCNQ1NewVariant.objects.filter(resnum__in=neighbors, total_carriers__gt=0)
    variant = KCNQ1NewVariant.objects.filter(var=var[0]).first()
    var_in_silico = KCNQ1InSilico.objects.filter(hgvsc=hgvsc).first()

    #if variant.mutAA == "X" or variant.mutAA == "fsX":
    #    var_type = False
    #else:
    var_type = True
    unaff = variant.total_carriers - variant.lqt1

    try:
        alpha = math.floor(float(variant.lqt1_penetrance*(variant.total_carriers+10)))-variant.lqt1
        beta = 10 - alpha
        alpha_lqt1 = alpha + variant.lqt1
        tot_with_prior = 10 + variant.total_carriers
    except ValueError and TypeError:
        alpha = "NA"
        beta = "NA"
        alpha_lqt1 = "NA"
        tot_with_prior = "MA"
    return render(request, 'kcnq1/detail.html', {'recs_dists': recs_dists, 'recs_funcs': recs_funcs,
                                                 'recs_clin': recs_clin, 'var': var, 'recs_vars': recs_vars,
                                                 'variant': variant, 'alpha': alpha,
                                                 'beta': beta, 'clin_papers': len(recs_clin),
                                                 'var_in_silico': var_in_silico, 'func_papers': len(recs_funcs),
                                                 'var_type': var_type, 'unaff': unaff, "alpha_lqt1":alpha_lqt1,
                                                 "tot_with_prior":tot_with_prior})

import math
from django.utils import timezone
from django.shortcuts import render
from django.views.decorators.cache import cache_page
from scn5a.models import newVariant_scn5a, scn5aDistances, scn5aPapers


# Create your views here.
# thirty days 86400 * 30
@cache_page(20)#(60*60*31)
def display(request):
    recs = newVariant_scn5a.objects.all()
    ret = render(request, 'scn5a/main.html', {'recs': recs})
    return ret


def variantview(request, hgvsc):
    resnum = newVariant_scn5a.objects.filter(hgvsc=hgvsc).values_list('resnum', flat=True)
    var = newVariant_scn5a.objects.filter(hgvsc=hgvsc).values_list('var', flat=True)
    recs_dists = scn5aDistances.objects.filter(resnum=int(resnum[0]), distance__lt=15)
    neighbors = scn5aDistances.objects.filter(resnum=int(resnum[0])).values_list('neighbor', flat=True)
    recs_funcs = set(scn5aPapers.objects.filter(variant=var[0], vhalf_act__isnull=False) |
                     scn5aPapers.objects.filter(variant=var[0], peak__isnull=False) |
                     scn5aPapers.objects.filter(variant=var[0], late__isnull=False)
                     )
    recs_clin = scn5aPapers.objects.filter(variant=var[0], total_carriers__gt=0)
    recs_vars = set(newVariant_scn5a.objects.filter(resnum__in=neighbors, lqt3__gt=0) |
                    newVariant_scn5a.objects.filter(resnum__in=neighbors, unaff__gt=0) |
                    newVariant_scn5a.objects.filter(resnum__in=neighbors, brs1__gt=0) |
                    newVariant_scn5a.objects.filter(resnum__in=neighbors, gnomad__gt=0)
                    )
    variant = newVariant_scn5a.objects.get(hgvsc=hgvsc)
    if variant.mutAA == "X" or variant.mutAA == "fsX":
        var_type = False
    else:
        var_type = True
    try:
        alpha_brs1 = math.floor(float(variant.alpha_brs1))
        beta_brs1 = 10 - alpha_brs1
        alpha_lqt3 = math.floor(float(variant.alpha_lqt3))
        beta_lqt3 = 5 - alpha_lqt3
        beta = beta_lqt3 + beta_brs1
    except ValueError and TypeError:
        alpha_brs1 = "NA"
        beta_brs1 = "NA"
        alpha_lqt3 = "NA"
        beta_lqt3 = "NA"
    return render(request, 'scn5a/detail.html', {'recs_dists': recs_dists, 'recs_funcs': recs_funcs,
                                           'recs_clin': recs_clin, 'var': var, 'recs_vars': recs_vars,
                                           'variant': variant, 'beta': beta,
                                           'alpha_brs1': alpha_brs1, 'beta_brs1': beta_brs1, 'alpha_lqt3': alpha_lqt3,
                                           'beta_lqt3': beta_lqt3, 'clin_papers': len(recs_clin),
                                           'func_papers': len(recs_funcs), 'var_type': var_type
                                                 })

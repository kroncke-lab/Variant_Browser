import math
from django.shortcuts import render
from ryr2.models import RYR2Variant

@cache_page(60*60*31)
def display(request):
    variants = RYR2Variant.objects.all()
    ret = render(request, 'ryr2/main.html', {'variants': variants})
    return ret

def variantview(request, hgvsc):
    resnum = RYR2Variant.objects.filter(hgvsc=hgvsc).values_list('resnum', flat=True)
    var = RYR2Variant.objects.filter(hgvsc=hgvsc).values_list('var', flat=True)
    recs_dists = RYR2Distances.objects.filter(resnum=int(resnum[0]), distance__lt=15)
    neighbors = RYR2Distances.objects.filter(resnum=int(resnum[0])).values_list('neighbor', flat=True)
    recs_funcs = RYR2FunctionalPapers.objects.filter(var=var[0])
    recs_clin = RYR2ClinicalPapers.objects.filter(var=var[0], pmid__isnull=False)
    recs_vars = RYR2Variant.objects.filter(resnum__in=neighbors, total_carriers__gt=0)
    variant = RYR2Variant.objects.filter(var=var[0]).first()
    var_in_silico = RYR2InSilico.objects.filter(hgvsc=hgvsc).first()

    var_type = True
    unaff = variant.total_carriers - variant.cpvt

    try:
        alpha = math.floor(float(variant.p_mean_w * (variant.total_carriers + 10))) - variant.cpvt
        beta = 10 - alpha
        alpha_cpvt = alpha + variant.cpvt
        tot_with_prior = 10 + variant.total_carriers
    except (ValueError, TypeError):
        alpha = "NA"
        beta = "NA"
        alpha_cpvt = "NA"
        tot_with_prior = "NA"

    return render(request, 'ryr2/detail.html', {
        'recs_dists': recs_dists,
        'recs_funcs': recs_funcs,
        'recs_clin': recs_clin,
        'var': var,
        'recs_vars': recs_vars,
        'variant': variant,
        'alpha': alpha,
        'beta': beta,
        'clin_papers': len(recs_clin),
        'var_in_silico': var_in_silico,
        'func_papers': len(recs_funcs),
        'var_type': var_type,
        'unaff': unaff,
        'alpha_cpvt': alpha_cpvt,
        'tot_with_prior': tot_with_prior
    })
import math
from django.shortcuts import render
from ryr2.models import RYR2Variant

def display(request):
    variants = RYR2Variant.objects.all()
    ret = render(request, 'ryr2/main.html', {'variants': variants})
    return ret

def variantview(request, hgvsc):
    # NOTE: This view has incomplete implementation - missing RYR2Distances,
    # RYR2FunctionalPapers, RYR2ClinicalPapers, and RYR2InSilico models
    # For now, providing basic variant info only

    variant = RYR2Variant.objects.filter(var=hgvsc).first()
    if not variant:
        # Try alternative lookup if hgvsc format doesn't match var field
        return render(request, 'ryr2/detail.html', {'error': 'Variant not found'})

    var_type = True
    unaff = variant.total_carriers - variant.cpvt

    try:
        alpha = math.floor(float(variant.p_mean_w * (variant.total_carriers + 10))) - variant.cpvt
        beta_calc = 10 - alpha
        alpha_cpvt = alpha + variant.cpvt
        tot_with_prior = 10 + variant.total_carriers
    except (ValueError, TypeError):
        alpha = "NA"
        beta_calc = "NA"
        alpha_cpvt = "NA"
        tot_with_prior = "NA"

    return render(request, 'ryr2/detail.html', {
        'recs_dists': [],
        'recs_funcs': [],
        'recs_clin': [],
        'var': [hgvsc],
        'recs_vars': [],
        'variant': variant,
        'alpha': alpha,
        'beta': beta_calc,
        'clin_papers': 0,
        'var_in_silico': None,
        'func_papers': 0,
        'var_type': var_type,
        'unaff': unaff,
        'alpha_cpvt': alpha_cpvt,
        'tot_with_prior': tot_with_prior
    })

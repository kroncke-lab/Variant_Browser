import math

from django.db.models import Q
from django.shortcuts import render
from django.views.decorators.cache import cache_page
from kcnq1.models import (
    KCNQ1NewVariant,
    KCNQ1ClinicalPapers,
    kcnq1Distances,
    KCNQ1FunctionalPapers,
    KCNQ1InSilico,
)


# Create your views here.
# thirty days 86400 * 30
@cache_page(60*60*31)
def display(request):
    recs = KCNQ1NewVariant.objects.only(
        'pos',
        'hgvsc',
        'var',
        'resnum',
        'lqt1',
        'total_carriers',
        'function_lqt1',
        'structure_lqt1',
        'lqt1_penetrance',
    )
    ret = render(request, 'kcnq1/main.html', {'recs': recs})
    return ret


@cache_page(60*60*31)
def variantview(request, hgvsc):
    variant = KCNQ1NewVariant.objects.select_related(None).only(
        'resnum',
        'var',
        'total_carriers',
        'lqt1',
        'lqt1_penetrance',
        'structure_lqt1',
        'function_lqt1',
        'gnomad',
    ).get(hgvsc=hgvsc)

    recs_dists = kcnq1Distances.objects.filter(resnum=variant.resnum, distance__lt=15)
    neighbors = list(
        kcnq1Distances.objects.filter(resnum=variant.resnum).values_list('neighbor', flat=True)
    )
    recs_funcs = KCNQ1FunctionalPapers.objects.filter(var=variant.var)
    recs_clin = KCNQ1ClinicalPapers.objects.filter(var=variant.var, pmid__isnull=False)
    recs_vars = KCNQ1NewVariant.objects.filter(resnum__in=neighbors).filter(
        Q(total_carriers__gt=0) | Q(gnomad__gt=0)
    )
    var_in_silico = KCNQ1InSilico.objects.filter(hgvsc=hgvsc).first()

    var_type = True
    unaff = variant.total_carriers - variant.lqt1

    try:
        alpha = math.floor(float(variant.lqt1_penetrance * (variant.total_carriers + 10))) - variant.lqt1
        beta = 10 - alpha
        alpha_lqt1 = alpha + variant.lqt1
        tot_with_prior = 10 + variant.total_carriers
    except (ValueError, TypeError):
        alpha = "NA"
        beta = "NA"
        alpha_lqt1 = "NA"
        tot_with_prior = "NA"

    return render(
        request,
        'kcnq1/detail.html',
        {
            'recs_dists': recs_dists,
            'recs_funcs': recs_funcs,
            'recs_clin': recs_clin,
            'var': [variant.var],
            'recs_vars': recs_vars,
            'variant': variant,
            'alpha': alpha,
            'beta': beta,
            'clin_papers': len(recs_clin),
            'var_in_silico': var_in_silico,
            'func_papers': len(recs_funcs),
            'var_type': var_type,
            'unaff': unaff,
            "alpha_lqt1": alpha_lqt1,
            "tot_with_prior": tot_with_prior,
        },
    )

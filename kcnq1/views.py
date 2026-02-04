import math
import logging

from django.db.models import Q
from django.http import Http404
from django.shortcuts import render, get_object_or_404
from django.views.decorators.cache import cache_page

logger = logging.getLogger(__name__)
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
    """
    Render the KCNQ1 variant browser page.
    Data is loaded via AJAX from /KCNQ1/api/variants/ for faster initial page load.
    """
    return render(request, 'kcnq1/main.html')


#@cache_page(60*60*31)
def variantview(request, hgvsc):
    variant = (
        KCNQ1NewVariant.objects
        .select_related(None)
        .only(
            'resnum',
            'var',
            'total_carriers',
            'lqt1',
            'lqt1_penetrance',
            'structure_lqt1',
            'function_lqt1',
            'gnomad',
            'lqt1_dist',  # Added: required by template line 94
        )
        .filter(hgvsc__iexact=hgvsc.strip())  # safer: ignore case and whitespace
        .first()
    )

    if not variant:
        logger.warning(f"Variant not found: {hgvsc}")
        raise Http404(f"Variant not found: {hgvsc}")


    recs_dists = kcnq1Distances.objects.filter(resnum=variant.resnum, distance__lt=15)
    neighbors = list(recs_dists.values_list('neighbor', flat=True))
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
            'clin_papers': recs_clin.count(),
            'var_in_silico': var_in_silico,
            'func_papers': recs_funcs.count(),
            'var_type': var_type,
            'unaff': unaff,
            "alpha_lqt1": alpha_lqt1,
            "tot_with_prior": tot_with_prior,
            'dist_dat': recs_dists,  # Template expects this name (line 247)
        },
    )

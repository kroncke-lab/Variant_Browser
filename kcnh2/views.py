import math

from django.db.models import Q
from django.shortcuts import render, get_object_or_404
from django.views.decorators.cache import cache_page
from kcnh2.models import newVariant, ClinicalPapers, kcnh2Distances, FunctionalPapers


# Create your views here.
@cache_page(60*60*31)
def display(request):
    recs = newVariant.objects.filter(isoform='A').only(
        'pos',
        'hgvsc',
        'var',
        'resnum',
        'lqt2',
        'total_carriers',
        'mave_score',
        'structure',
        'p_mean_w',
    )
    ret = render(request, 'kcnh2/main.html', {'recs': recs})
    return ret


@cache_page(60*60*31)
def variantview(request, hgvsc):
    variant = get_object_or_404(
        newVariant.objects.select_related(None).only(
            'resnum',
            'var',
            'mutAA',
            'total_carriers',
            'mave_score_all',
            'mave_score_SE',
            'alpha',
            'lqt2',
            'unaff',
            'gnomad',
            'structure',
            'p_mean_w',
            'pph2_prob',
            'provean_score',
            'blast_pssm',
            'revel_score',
            'lqt2_dist',
        ),
        hgvsc=hgvsc
    )

    recs_dists = kcnh2Distances.objects.filter(resnum=variant.resnum, distance__lt=15)
    neighbors = list(recs_dists.values_list('neighbor', flat=True))
    recs_funcs = FunctionalPapers.objects.filter(variant=variant.var)
    recs_clin = ClinicalPapers.objects.filter(variant=variant.var)
    recs_vars = newVariant.objects.filter(resnum__in=neighbors).filter(
        Q(lqt2__gt=0) | Q(unaff__gt=0)
    )

    total_carriers = variant.total_carriers
    mave_score = variant.mave_score_all
    mave_score_SE = variant.mave_score_SE

    var_type = not (variant.mutAA in {"X", "fsX"})

    try:
        alpha = math.floor(float(variant.alpha))
        beta = 10 - alpha
        alpha_lqt2 = alpha + variant.lqt2
        tot_with_prior = 10 + variant.total_carriers
    except (ValueError, TypeError):
        alpha = "NA"
        beta = "NA"
        alpha_lqt2 = "NA"
        tot_with_prior = "NA"

    return render(
        request,
        'kcnh2/detail.html',
        {
            'mave_score': mave_score,
            'mave_score_SE': mave_score_SE,
            'recs_dists': recs_dists,
            'recs_funcs': recs_funcs,
            'recs_clin': recs_clin,
            'var': [variant.var],
            'recs_vars': recs_vars,
            'variant': variant,
            'total_carriers': total_carriers,
            'alpha': alpha,
            'beta': beta,
            'clin_papers': recs_clin.count(),
            'func_papers': recs_funcs.count(),
            'var_type': var_type,
            "alpha_lqt2": alpha_lqt2,
            "tot_with_prior": tot_with_prior,
        },
    )

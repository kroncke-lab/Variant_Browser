import math

from django.db.models import Q
from django.shortcuts import render
from django.views.decorators.cache import cache_page
from scn5a.models import newVariant_scn5a, scn5aDistances, scn5aPapers


# Create your views here.
# thirty days 86400 * 30
@cache_page(60*60*31)
def display(request):
    recs = newVariant_scn5a.objects.only(
        'pos',
        'hgvsc',
        'var',
        'resnum',
        'lqt3',
        'brs1',
        'total_carriers',
        'function',
        'structure_lqt3',
        'lqt3_penetrance',
        'brs1_penetrance',
    )
    ret = render(request, 'scn5a/main.html', {'recs': recs})
    return ret


@cache_page(60*60*31)
def variantview(request, hgvsc):
    variant = newVariant_scn5a.objects.select_related(None).only(
        'resnum',
        'var',
        'mutAA',
        'total_carriers',
        'alpha_brs1',
        'alpha_lqt3',
        'lqt3',
        'brs1',
        'beta_brs1',
        'beta_lqt3',
        'unaff',
        'gnomad',
        'structure_brs1',
        'structure_lqt3',
        'pph2_prob',
        'provean_score',
        'blast_pssm',
        'revel_score',
        'lqt3_dist',
        'brs1_dist',
    ).get(hgvsc=hgvsc)

    recs_dists = scn5aDistances.objects.filter(resnum=variant.resnum, distance__lt=15)
    neighbors = list(recs_dists.values_list('neighbor', flat=True))
    recs_funcs = scn5aPapers.objects.filter(variant=variant.var).filter(
        Q(vhalf_act__isnull=False) | Q(peak__isnull=False) | Q(late__isnull=False)
    )
    recs_clin = scn5aPapers.objects.filter(variant=variant.var, total_carriers__gt=0)
    recs_vars = newVariant_scn5a.objects.filter(resnum__in=neighbors).filter(
        Q(lqt3__gt=0) | Q(unaff__gt=0) | Q(brs1__gt=0) | Q(gnomad__gt=0)
    )

    var_type = not (variant.mutAA in {"X", "fsX"})

    beta = "NA"
    try:
        alpha_brs1 = math.floor(float(variant.alpha_brs1))
        beta_brs1 = 10 - alpha_brs1
        alpha_lqt3 = math.floor(float(variant.alpha_lqt3))
        beta_lqt3 = 5 - alpha_lqt3
        beta = beta_lqt3 + beta_brs1
        alpha_lqt3_tot = alpha_lqt3 + variant.lqt3
        tot_with_prior_lqt3 = 10 + variant.total_carriers
        alpha_brs1_tot = alpha_brs1 + variant.brs1
        tot_with_prior_brs1 = 10 + variant.total_carriers
    except (ValueError, TypeError):
        alpha_brs1 = "NA"
        beta_brs1 = "NA"
        alpha_lqt3 = "NA"
        beta_lqt3 = "NA"
        alpha_lqt3_tot = "NA"
        tot_with_prior_lqt3 = "NA"
        alpha_brs1_tot = "NA"
        tot_with_prior_brs1 = "NA"

    return render(
        request,
        'scn5a/detail.html',
        {
            'recs_dists': recs_dists,
            'recs_funcs': recs_funcs,
            'recs_clin': recs_clin,
            'var': [variant.var],
            'recs_vars': recs_vars,
            'variant': variant,
            'beta': beta,
            'alpha_brs1': alpha_brs1,
            'beta_brs1': beta_brs1,
            'alpha_lqt3': alpha_lqt3,
            'beta_lqt3': beta_lqt3,
            'clin_papers': recs_clin.count(),
            'func_papers': recs_funcs.count(),
            'var_type': var_type,
            "alpha_lqt3_tot": alpha_lqt3_tot,
            "tot_with_prior_lqt3": tot_with_prior_lqt3,
            "alpha_brs1_tot": alpha_brs1_tot,
            "tot_with_prior_brs1": tot_with_prior_brs1,
        },
    )

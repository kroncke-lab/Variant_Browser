"""
AJAX data endpoint for SCN5A variants.
Returns all variants as JSON for client-side DataTables processing.
JSON is ~5x smaller than HTML table markup and parses faster.
"""
from django.http import JsonResponse
from django.views.decorators.gzip import gzip_page
from scn5a.models import newVariant_scn5a


def calculate_penetrance(alpha, beta_val, affected, total_carriers):
    """
    Calculate Bayesian penetrance estimate from alpha/beta priors and observed data.
    Returns penetrance as percentage (0-100).
    """
    try:
        alpha_f = float(alpha) if alpha else 0
        beta_f = float(beta_val) if beta_val else 0
        if alpha_f <= 0 or beta_f <= 0:
            return None
        # Posterior: alpha + affected, beta + (total - affected)
        post_alpha = alpha_f + (affected or 0)
        post_beta = beta_f + max((total_carriers or 0) - (affected or 0), 0)
        # Mean of beta distribution
        mean = post_alpha / (post_alpha + post_beta)
        return round(mean * 100, 1)
    except (ValueError, TypeError):
        return None


@gzip_page
def datatables_api(request):
    """
    Returns all SCN5A variants as JSON for DataTables.
    Uses client-side processing for better UX with filtering/sorting.
    """
    # Get all variants with needed fields
    variants = newVariant_scn5a.objects.only(
        'pos',
        'hgvsc',
        'var',
        'resnum',
        'lqt3',
        'brs1',
        'total_carriers',
        'gnomad',
        'function',
        'structure_lqt3',
        'alpha_lqt3',
        'beta_lqt3',
        'alpha_brs1',
        'beta_brs1',
    ).order_by('pos')

    # Build compact JSON response
    data = []
    total_lqt3 = 0
    total_brs1 = 0
    total_lit = 0
    total_gnomad = 0
    pen_lqt3_sum = 0
    pen_brs1_sum = 0
    pen_lqt3_count = 0
    pen_brs1_count = 0

    for v in variants:
        # Calculate lit/cohort carriers
        total = v.total_carriers or 0
        gnomad_count = v.gnomad or 0
        lit_cohort = max(total - gnomad_count, 0)
        lqt3_count = v.lqt3 or 0
        brs1_count = v.brs1 or 0

        # Calculate penetrance from alpha/beta priors
        lqt3_pct = calculate_penetrance(v.alpha_lqt3, v.beta_lqt3, lqt3_count, total)
        brs1_pct = calculate_penetrance(v.alpha_brs1, v.beta_brs1, brs1_count, total)

        # Accumulate stats
        total_lqt3 += lqt3_count
        total_brs1 += brs1_count
        total_lit += lit_cohort
        total_gnomad += gnomad_count
        if lqt3_pct is not None:
            pen_lqt3_sum += lqt3_pct
            pen_lqt3_count += 1
        if brs1_pct is not None:
            pen_brs1_sum += brs1_pct
            pen_brs1_count += 1

        data.append([
            v.pos,                                          # 0: Ch.3 position
            truncate(v.hgvsc, 12) if v.hgvsc else '',      # 1: HGVSc short
            v.hgvsc,                                        # 2: HGVSc full (for link)
            truncate(v.var, 7) if v.var else '',           # 3: Variant short
            v.resnum,                                       # 4: Residue Number
            lqt3_count,                                     # 5: LQT3 count
            brs1_count,                                     # 6: BrS1 count
            lit_cohort,                                     # 7: Lit/Cohort carriers
            gnomad_count,                                   # 8: gnomAD carriers
            v.function if v.function else '',              # 9: Function
            v.structure_lqt3 if v.structure_lqt3 else '',  # 10: Location
            lqt3_pct if lqt3_pct is not None else 0,       # 11: LQT3 Penetrance %
            brs1_pct if brs1_pct is not None else 0,       # 12: BrS1 Penetrance %
        ])

    avg_lqt3_pen = round(pen_lqt3_sum / pen_lqt3_count, 1) if pen_lqt3_count > 0 else 0
    avg_brs1_pen = round(pen_brs1_sum / pen_brs1_count, 1) if pen_brs1_count > 0 else 0

    return JsonResponse({
        'data': data,
        'stats': {
            'totalLqt3': total_lqt3,
            'totalBrs1': total_brs1,
            'totalLit': total_lit,
            'totalGnomad': total_gnomad,
            'avgLqt3Pen': avg_lqt3_pen,
            'avgBrs1Pen': avg_brs1_pen,
        }
    })


def truncate(value, length):
    """Truncate string with ellipsis if longer than length."""
    if not value:
        return ''
    s = str(value)
    if len(s) > length:
        return s[:length-1] + '…'
    return s

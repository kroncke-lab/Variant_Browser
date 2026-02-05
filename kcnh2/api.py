"""
AJAX data endpoint for KCNH2 variants.
Returns all variants as JSON for client-side DataTables processing.
JSON is ~5x smaller than HTML table markup and parses faster.
"""
from django.http import JsonResponse
from django.views.decorators.cache import cache_page
from kcnh2.models import newVariant


@cache_page(60 * 60 * 24)  # Cache for 24 hours
def datatables_api(request):
    """
    Returns all KCNH2 isoform A variants as JSON for DataTables.

    Client-side DataTables will handle:
    - Sorting
    - Filtering/Search
    - Virtual scrolling
    - Histogram updates

    This is much faster than rendering 8000 <tr> elements in Django template.

    Column mapping:
    [0] pos - Ch.7 position
    [1] hgvsc_short - truncated HGVSc for display
    [2] hgvsc_full - full HGVSc for variant link
    [3] var_short - truncated variant for display
    [4] resnum - Residue Number
    [5] lqt2 - LQT2 count
    [6] lit_cohort - Literature/Cohort carriers (total - gnomad)
    [7] gnomad - gnomAD carriers
    [8] mave_score - MAVE Function
    [9] structure - Location
    [10] p_pct - LQT2 Penetrance %
    """
    # Get all isoform A variants with only needed fields
    variants = newVariant.objects.filter(isoform='A').only(
        'pos',
        'hgvsc',
        'var',
        'resnum',
        'lqt2',
        'total_carriers',
        'gnomad',
        'mave_score',
        'structure',
        'p_mean_w',
    ).order_by('-pos')

    # Build compact JSON response
    data = []
    for v in variants:
        # Calculate penetrance percentage (p_mean_w is 0-1, convert to 0-100)
        p_pct = int(v.p_mean_w * 100) if v.p_mean_w else 0

        # Calculate lit/cohort carriers (total minus gnomad)
        total = v.total_carriers if v.total_carriers else 0
        gnomad = v.gnomad if v.gnomad else 0
        lit_cohort = max(0, total - gnomad)

        data.append([
            v.pos,
            truncate(v.hgvsc, 9) if v.hgvsc else '',
            v.hgvsc,  # Full hgvsc for link
            truncate(v.var, 7) if v.var else '',
            v.resnum,
            v.lqt2 if v.lqt2 else 0,
            lit_cohort,
            gnomad,
            v.mave_score if v.mave_score is not None else '',
            v.structure if v.structure else '',
            p_pct,
        ])

    return JsonResponse({'data': data})


def truncate(value, length):
    """Truncate string with ellipsis if longer than length."""
    if not value:
        return ''
    s = str(value)
    if len(s) > length:
        return s[:length-1] + '…'
    return s

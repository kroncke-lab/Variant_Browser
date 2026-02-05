"""
AJAX data endpoint for KCNQ1 variants.
Returns all variants as JSON for client-side DataTables processing.
JSON is ~5x smaller than HTML table markup and parses faster.
"""
from django.http import JsonResponse
from kcnq1.models import KCNQ1NewVariant


def datatables_api(request):
    """
    Returns all KCNQ1 variants as JSON for DataTables.

    Client-side DataTables will handle:
    - Sorting
    - Filtering/Search
    - Virtual scrolling
    - Histogram updates

    This is much faster than rendering thousands of <tr> elements in Django template.

    Column mapping:
    [0] pos - Ch.11 position
    [1] hgvsc_short - truncated HGVSc for display
    [2] hgvsc_full - full HGVSc for variant link
    [3] var_short - truncated variant for display
    [4] resnum - Residue Number
    [5] lqt1 - LQT1 count
    [6] lit_cohort - Literature/Cohort carriers (total - gnomad)
    [7] gnomad - gnomAD carriers
    [8] function - Function classification
    [9] structure - Location (LQT1)
    [10] lqt1_pct - LQT1 Penetrance %
    """
    # Get all variants with only needed fields
    variants = KCNQ1NewVariant.objects.only(
        'pos',
        'hgvsc',
        'var',
        'resnum',
        'lqt1',
        'total_carriers',
        'gnomad',
        'function_lqt1',
        'structure_lqt1',
        'lqt1_penetrance',
    ).order_by('pos')

    # Build compact JSON response
    data = []
    for v in variants:
        # lqt1_penetrance is stored as decimal 0-1, convert to percentage
        p_pct = int(v.lqt1_penetrance * 100) if v.lqt1_penetrance else 0

        # Calculate lit/cohort carriers (total minus gnomad)
        total = v.total_carriers if v.total_carriers else 0
        gnomad = v.gnomad if v.gnomad else 0
        lit_cohort = max(0, total - gnomad)

        data.append([
            v.pos,
            truncate(v.hgvsc, 12) if v.hgvsc else '',
            v.hgvsc,  # Full hgvsc for link
            truncate(v.var, 7) if v.var else '',
            v.resnum,
            v.lqt1 if v.lqt1 else 0,
            lit_cohort,
            gnomad,
            v.function_lqt1 if v.function_lqt1 else '',
            v.structure_lqt1 if v.structure_lqt1 else '',
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

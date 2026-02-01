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
    """
    # Get all isoform A variants with only needed fields
    variants = newVariant.objects.filter(isoform='A').only(
        'pos',
        'hgvsc', 
        'var',
        'resnum',
        'lqt2',
        'total_carriers',
        'mave_score',
        'structure',
        'p_mean_w',
    ).order_by('-pos')
    
    # Build compact JSON response
    data = []
    for v in variants:
        # Calculate penetrance percentage
        p_pct = int(v.p_mean_w * 100) if v.p_mean_w else 0
        
        data.append([
            v.pos,
            truncate(v.hgvsc, 9) if v.hgvsc else '',
            v.hgvsc,  # Full hgvsc for link (column will be hidden, used for rendering)
            truncate(v.var, 7) if v.var else '',
            v.resnum,
            v.lqt2 if v.lqt2 else 0,
            v.total_carriers if v.total_carriers else 0,
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

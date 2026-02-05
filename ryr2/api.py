"""
AJAX data endpoint for RYR2 variants.
Returns all variants as JSON for client-side DataTables processing.
JSON is ~5x smaller than HTML table markup and parses faster.
"""
from django.http import JsonResponse
from ryr2.models import RYR2Variant
import logging
import time


logger = logging.getLogger(__name__)


def datatables_api(request):
    """
    Returns all RYR2 variants as JSON for DataTables.

    Client-side DataTables will handle:
    - Sorting
    - Filtering/Search
    - Virtual scrolling
    - Histogram updates

    This is much faster than rendering thousands of <tr> elements in Django template.
    """
    start = time.monotonic()
    try:
        variants = RYR2Variant.objects.only(
            'grch38_pos',
            'var',
            'resnum',
            'cpvt',
            'total_carriers',
            'unaff',
            'hotspot',
            'p_mean_w',
        ).order_by('grch38_pos')

        # Build compact JSON response
        data = []
        for v in variants:
            # RyR2 data doesn't include gnomAD; total_carriers is lit/cohort.
            lit_cohort = v.total_carriers or 0
            unaff = v.unaff or 0

            # Get penetrance percentage
            cpvt_pct = int(v.p_mean_w * 100) if v.p_mean_w else 0

            data.append([
                v.grch38_pos,                              # 0: Ch.1 position (grch38)
                v.var if v.var else '',                    # 1: Variant
                v.resnum,                                  # 2: Residue Number
                v.cpvt if v.cpvt else 0,                  # 3: CPVT count
                lit_cohort,                                # 4: Lit/Cohort carriers
                unaff,                                     # 5: Unaffected carriers
                v.hotspot if v.hotspot else '',           # 6: Hotspot
                cpvt_pct,                                  # 7: CPVT Penetrance %
            ])

        duration_s = time.monotonic() - start
        logger.info("RYR2 API ok: rows=%s duration=%.2fs", len(data), duration_s)
        return JsonResponse({'data': data})
    except Exception:
        duration_s = time.monotonic() - start
        logger.exception("RYR2 API failed after %.2fs", duration_s)
        return JsonResponse({'error': 'RYR2 API error'}, status=500)

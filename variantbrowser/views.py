from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q

# Create your views here.

def home(request):
    return render(request, 'home.html')


def variant_search(request):
    """API endpoint for variant search across all genes."""
    query = request.GET.get('q', '').strip()
    
    if len(query) < 2:
        return JsonResponse({'results': [], 'error': 'Query too short'})
    
    results = []
    
    # Import models from each gene app
    try:
        from kcnh2.models import newVariant as KCNH2Variant
        kcnh2_matches = KCNH2Variant.objects.filter(
            Q(var__icontains=query) | Q(hgvsc__icontains=query)
        )[:10]
        for v in kcnh2_matches:
            results.append({
                'gene': 'KCNH2',
                'variant': v.var,
                'hgvsc': v.hgvsc,
                'penetrance': round(v.p_mean_w * 100) if v.p_mean_w else None,
                'url': f'/kcnh2/{v.hgvsc}/'
            })
    except Exception as e:
        pass  # Gene might not be available
    
    try:
        from kcnq1.models import newVariant as KCNQ1Variant
        kcnq1_matches = KCNQ1Variant.objects.filter(
            Q(var__icontains=query) | Q(hgvsc__icontains=query)
        )[:10]
        for v in kcnq1_matches:
            results.append({
                'gene': 'KCNQ1',
                'variant': v.var,
                'hgvsc': v.hgvsc,
                'penetrance': round(v.lqt1_penetrance * 100) if hasattr(v, 'lqt1_penetrance') and v.lqt1_penetrance else None,
                'url': f'/kcnq1/{v.hgvsc}/'
            })
    except Exception as e:
        pass
    
    try:
        from scn5a.models import newVariant as SCN5AVariant
        scn5a_matches = SCN5AVariant.objects.filter(
            Q(var__icontains=query) | Q(hgvsc__icontains=query)
        )[:10]
        for v in scn5a_matches:
            results.append({
                'gene': 'SCN5A',
                'variant': v.var,
                'hgvsc': v.hgvsc,
                'penetrance': None,  # Has two penetrance values
                'url': f'/scn5a/{v.hgvsc}/'
            })
    except Exception as e:
        pass
    
    try:
        from ryr2.models import newVariant as RYR2Variant
        ryr2_matches = RYR2Variant.objects.filter(
            Q(var__icontains=query)
        )[:10]
        for v in ryr2_matches:
            results.append({
                'gene': 'RYR2',
                'variant': v.var,
                'hgvsc': getattr(v, 'hgvsc', ''),
                'penetrance': round(v.p_mean_w * 100) if hasattr(v, 'p_mean_w') and v.p_mean_w else None,
                'url': f'/ryr2/{v.var}/'
            })
    except Exception as e:
        pass
    
    # Sort by gene, then variant
    results.sort(key=lambda x: (x['gene'], x['variant']))
    
    return JsonResponse({'results': results[:20], 'query': query})


def about(request):
    return render(request, 'about.html')


def penetrance_estimation(request):
    return render(request, 'penetrance_estimate.html')


def penetrance_estimation_first_SCN5A(request):
    return render(request, 'penetrance_protocol_first_SCN5A.html')

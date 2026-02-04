# Variant_Browser

## Objective
Clinical web UI for variant interpretation in cardiac channelopathy genes.
Display Bayesian penetrance estimates, functional data, and in silico predictors.

## Current Status
- **Genes:** KCNH2, KCNQ1, RYR2, SCN5A
- **Stack:** Django 3.2, DataTables, Plotly, Bootstrap, Azure SQL
- **Deployment:** Azure App Service (dev server)
- **Priority:** PAUSED (Brett handling)

## Unique Value Proposition
Features **none of the major tools have**:
- Bayesian penetrance estimates with 90% credible intervals
- Variant-feature-based priors (structural/functional location)
- Integrated MAVE high-throughput functional data
- Gene-specific expertise (cardiac channelopathies)

## Architecture
```
Variant_Browser/
├── variant_browser/           # Main Django project
│   ├── settings/
│   └── urls.py
├── kcnh2/                     # Gene-specific app
│   ├── models.py              # Variant models (managed=False)
│   ├── views.py               # DataTables AJAX
│   └── templates/
├── scn5a/, kcnq1/, ryr2/      # Other gene apps (same structure)
├── penetrance_estimate_protocol/  # Methodology explanation
└── templates/
    └── base.html
```

## Key Features (Implemented)
- ✅ DataTables with SearchBuilder/SearchPanes filtering
- ✅ Quick stats banner & color-coded penetrance
- ✅ MAVE functional data integration
- ✅ In silico predictors (PROVEAN, PolyPhen-2, REVEL, BLAST-PSSM)
- ✅ Literature carrier counts with PubMed links
- ✅ Structural neighbor analysis
- ✅ Homepage search with autocomplete

## Recommended Improvements (from Council Review)
### Phase 1 (Quick wins)
1. External database links (ClinVar, gnomAD, UniProt)
2. Copy-to-clipboard buttons
3. Data freshness indicator
4. Shareable filter URLs

### Phase 2 (Medium effort)
1. Batch variant lookup
2. PDF export for detail pages
3. ACMG evidence badges
4. Penetrance confidence visualization

### Phase 3 (Larger features)
1. Interactive protein lollipop diagram
2. RESTful API
3. 3D structure viewer integration

## Database Notes
- Models have `managed = False` (expect pre-existing Azure SQL tables)
- Gene pages require Azure SQL connection (fail in SQLite mode)
- Static pages work locally: `/`, `/about/`, `/penetrance_estimate_protocol/`

## Git Issues
- **venv/ committed to history** - 7,046 files bloating repo
- **Recommendation:** Use `git filter-repo` to clean (see REPO_BLOAT_ANALYSIS.md)

## Related Repos
- **VariantFeatures** - Upstream: provides aggregated features
- **BayesianPenetranceEstimator** - Upstream: provides penetrance estimates
- **GeneVariantFetcher** - Upstream: provides literature carrier counts

## Next Steps
See TASKS.md if it exists. Currently paused per Brett's direction.

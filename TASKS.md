# Variant Browser - Feature Roadmap & Tasks

**Last Updated:** 2026-02-05
**Source:** Multi-perspective UX council review (clinician, genetic counselor, researcher, UX designer)

---

## Executive Summary

The Variant Browser has strong data foundations but needs UX improvements to become a daily-use clinical tool. The **#1 gap across all user groups** is the lack of a homepage search bar for instant variant lookup.

**Variant Browser's unique edge:** Penetrance estimation — no competitor (ClinVar, gnomAD) provides this. Position as the "clinical decision support layer" on top of existing databases.

---

## Priority Tiers

| Tier | Definition |
|------|------------|
| **P0** | Critical — blocks adoption |
| **P1** | High impact — significantly improves UX |
| **P2** | Medium impact — quality of life improvements |
| **P3** | Nice to have — future enhancements |

---

## P0 — Critical (Blocks Adoption)

### 1. Global Variant Search on Homepage
**Status:** [ ] Not started
**Effort:** Medium
**Impact:** ALL user groups

- [ ] Add prominent search bar on homepage
- [ ] Accept multiple nomenclatures: `A561V`, `p.Ala561Val`, `KCNH2 R534H`, `NM_000238.3:c.1682C>T`
- [ ] Auto-detect gene from variant name
- [ ] Autocomplete with fuzzy matching
- [ ] Direct navigation to variant result

**User quote:** "If I can't type a variant and get an answer in 10 seconds, I'll look it up later — which means never."

---

### 2. URL-Encoded Filter State (Shareable Links)
**Status:** [ ] Not started
**Effort:** Low
**Impact:** Clinicians, counselors, researchers

- [ ] Encode filter parameters in URL: `variantbrowser.org/KCNH2?penetrance_min=40&domain=pore`
- [ ] Enable browser back/forward navigation
- [ ] Allow bookmarking specific filtered views
- [ ] "Copy link" button for sharing with colleagues

---

### 3. Variant Detail Panel / Clinical Summary Card
**Status:** [ ] Not started
**Effort:** Medium
**Impact:** Clinicians, counselors

Single-screen summary showing:
- [ ] Penetrance estimate with visual gauge (not just number)
- [ ] Confidence indicator (based on carrier count)
- [ ] Risk tier: 🟢 LOW (<20%) / 🟡 MODERATE (20-50%) / 🔴 HIGH (>50%)
- [ ] Plain-English one-sentence summary
- [ ] ClinVar classification (if integrated)
- [ ] Domain/structural location

---

## P1 — High Impact

### 4. Plain Language / Patient-Friendly Mode
**Status:** [ ] Not started
**Effort:** Medium
**Impact:** Clinicians, counselors

- [ ] Toggle between "Technical" and "Patient-Friendly" views
- [ ] Replace jargon throughout:

| Technical Term | Patient-Friendly |
|----------------|------------------|
| Penetrance | Lifetime risk of symptoms |
| MAVE | Lab-measured function |
| In silico | Computer-predicted |
| Heterozygote | Carrier |
| gnomAD | General population database |
| Bayesian | (just say "estimated") |

- [ ] Add hover tooltips for all technical terms
- [ ] Ensure 8th-grade reading level for patient-facing content

---

### 5. ClinVar Integration
**Status:** [ ] Not started
**Effort:** Medium
**Impact:** Counselors, researchers

- [ ] Display ClinVar classification badge (P/LP/VUS/LB/B)
- [ ] Show star rating and submitter count
- [ ] Link to ClinVar entry
- [ ] Highlight discordant variants (high penetrance + VUS = reclassification candidate)
- [ ] Filter by ClinVar classification

---

### 6. Natural Frequency Framing
**Status:** [ ] Not started
**Effort:** Low
**Impact:** Clinicians, counselors

Instead of: "Penetrance: 45%"
Display: "Roughly 1 in 2 carriers develop symptoms" or "45 out of 100 carriers..."

- [ ] Add natural frequency display alongside percentages
- [ ] Include in patient-friendly mode by default

---

### 7. Confidence/Uncertainty Indicators
**Status:** [ ] Not started
**Effort:** Low
**Impact:** ALL user groups

- [ ] Visual indicator of data quality:
  - "Well-established" (>20 carriers)
  - "Emerging evidence" (5-20 carriers)
  - "Limited data" (<5 carriers)
- [ ] Always show confidence intervals
- [ ] "n carriers observed" prominently displayed

---

### 8. Inline Glossary Tooltips
**Status:** [ ] Not started
**Effort:** Low
**Impact:** ALL user groups

- [ ] Hover definitions for all technical terms
- [ ] Use `<abbr>` tags for accessibility
- [ ] Consistent across all pages

---

## P2 — Medium Impact

### 9. 3D Protein Structure Viewer
**Status:** [ ] Not started
**Effort:** High
**Impact:** Researchers, advanced users

- [ ] Embed Mol* or NGL Viewer
- [ ] Color residues by penetrance (gradient)
- [ ] Highlight selected variant
- [ ] Toggle views: surface, cartoon, stick
- [ ] Link to PDB entry

---

### 10. REST API for Programmatic Access
**Status:** [ ] Not started
**Effort:** High
**Impact:** Researchers

- [ ] `GET /api/v1/variants?gene=KCNH2&penetrance_min=0.3`
- [ ] `GET /api/v1/variant/{gene}/{position}/{change}`
- [ ] Batch lookup endpoint
- [ ] Rate limiting (1000+ queries/hour)
- [ ] API documentation with Python/R examples

---

### 11. VUS Evidence Summary Cards
**Status:** [ ] Not started
**Effort:** Medium
**Impact:** Counselors, researchers

For each variant:
- [ ] Functional data available? (Y/N)
- [ ] Observed in affected carriers? (#)
- [ ] Observed in unaffected carriers? (#)
- [ ] Population frequency context
- [ ] ACMG criteria mapping (PS3, PM1, PP3, etc.)

---

### 12. Cascade Testing Decision Support
**Status:** [ ] Not started
**Effort:** Medium
**Impact:** Counselors

- [ ] "Family Testing" mode with plain-language summary
- [ ] Risk-stratified guidance:
  - High penetrance → emphasize cascade testing urgency
  - Low penetrance → frame differently
- [ ] Link to surveillance recommendations (HRS/ACC guidelines)

---

### 13. Progressive Column Disclosure
**Status:** [ ] Not started
**Effort:** Low
**Impact:** ALL user groups

- [ ] Default view: 5-6 essential columns (Variant, Gene, Penetrance, Classification, Key Predictors)
- [ ] "Show all columns" expands full view
- [ ] Save user column preferences

---

### 14. Versioned Data Releases
**Status:** [ ] Not started
**Effort:** Medium
**Impact:** Researchers

- [ ] Archive monthly/quarterly snapshots
- [ ] Display "Data current as of: [DATE]" prominently
- [ ] Include version info in exports
- [ ] Auto-generate citation text for downloads

---

### 15. Position vs Penetrance Scatter Plot
**Status:** [ ] Not started
**Effort:** Medium
**Impact:** Researchers

- [ ] X: amino acid position, Y: penetrance
- [ ] Point size by carrier count
- [ ] Color by domain
- [ ] Hover for variant details
- [ ] Export as publication-ready figure

---

### 16. Print/Export Patient Summary
**Status:** [ ] Not started
**Effort:** Medium
**Impact:** Counselors, clinicians

- [ ] One-page PDF suitable for patient handout
- [ ] Plain language summary
- [ ] Visual penetrance gauge
- [ ] Copy-to-clipboard for EHR notes

---

## P3 — Nice to Have

### 17. gnomAD Population-Specific Frequencies
- [ ] Break out frequencies by population (NFE, AFR, EAS, etc.)
- [ ] Show homozygote counts
- [ ] Compute enrichment odds ratio vs gnomAD

### 18. Batch Variant Lookup
- [ ] Upload VCF file → get penetrance for all variants
- [ ] Paste list of variants → batch query
- [ ] Accept rsIDs and gnomAD IDs

### 19. Age-Related Penetrance Curves
- [ ] If data exists, show penetrance by age
- [ ] "By age 40, approximately X% of carriers have symptoms"

### 20. Variant Comparison Feature
- [ ] Side-by-side comparison of 2+ variants
- [ ] Useful for family counseling

### 21. Interactive Onboarding Tutorial
- [ ] 4-step walkthrough for first-time users
- [ ] Dismissible, shows once per browser
- [ ] Use Shepherd.js or similar

### 22. Mobile-Responsive Card Layout
- [ ] Alternative to DataTable for small screens
- [ ] One variant per card
- [ ] Touch-friendly (44x44px targets)

### 23. Accessibility Audit
- [ ] WCAG 2.1 AA compliance
- [ ] Colorblind-safe palette
- [ ] Screen reader compatibility
- [ ] Keyboard navigation

### 24. Cross-Database Links
- [ ] "View in ClinVar" button
- [ ] "View in gnomAD" button
- [ ] Links to UniProt, AlphaMissense, PDB

### 25. Structural Context Fields
- [ ] Secondary structure (helix/sheet/loop)
- [ ] Solvent accessibility
- [ ] Distance to pore axis
- [ ] Intra-protein contacts

---

## Known Issues / Bug Fixes

### From Status Report (2026-02-05)
- [ ] Protocol link 400 error — add `www.variantbrowser.org` to ALLOWED_HOSTS
- [ ] Django version: upgraded to 4.2.28 (was 3.2) — verify stability
- [ ] Uncommitted `requirements.txt` changes
- [ ] Feature branch `boswell/phase1-quick-wins` incomplete and unmerged

---

## User Group Summary

### Clinicians Want:
1. Search → answer in <10 seconds
2. Risk tiers (🟢🟡🔴) not just percentages
3. Plain English, hide the science

### Genetic Counselors Want:
1. Patient-friendly language toggle
2. VUS evidence mapping to ACMG
3. Cascade testing guidance
4. Natural frequency framing

### Researchers Want:
1. API access
2. ClinVar integration
3. 3D structure viewer
4. Bulk data with versioning

### All Users Want:
1. **Global search bar** (unanimous #1)
2. Shareable URLs
3. Confidence indicators
4. Mobile support

---

## Implementation Notes

**Quick Wins (Low effort, high impact):**
1. Homepage search bar
2. URL-encoded filters
3. Inline tooltips
4. Natural frequency display
5. "Last updated" timestamp

**Foundations to Build:**
1. API infrastructure
2. ClinVar data integration
3. 3D viewer embedding

---

*Generated from multi-perspective UX council: clinician, genetic counselor, researcher, UX designer (2026-02-05)*

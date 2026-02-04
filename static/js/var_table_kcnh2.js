/**
 * KCNH2 Variant Table with AJAX Data Loading
 * 
 * Data is loaded via AJAX from /kcnh2/api/variants/ as JSON.
 * This is ~5x smaller than HTML table markup and much faster to load.
 * 
 * Column mapping from API:
 * [0] pos - Ch.7 position
 * [1] hgvsc_short - truncated HGVSc for display
 * [2] hgvsc_full - full HGVSc for variant link
 * [3] var_short - truncated variant for display
 * [4] resnum - Residue Number
 * [5] lqt2 - LQT2 count
 * [6] lit_cohort - Lit/Cohort carriers
 * [7] gnomad - gnomAD carriers
 * [8] mave_score - MAVE Function
 * [9] structure - Location
 * [10] p_pct - LQT2 Penetrance %
 */

$(document).ready(function() {
    initTable();
});

// Color-coded penetrance for visual risk assessment
function getPenetranceColor(value) {
    var v = parseFloat(value);
    if (isNaN(v)) return 'transparent';
    if (v < 20) return '#dcfce7'; // green-100 - low risk
    if (v < 40) return '#fef9c3'; // yellow-100 - moderate-low
    if (v < 60) return '#fed7aa'; // orange-100 - moderate
    if (v < 80) return '#fecaca'; // red-100 - high
    return '#fca5a5'; // red-300 - very high
}

function getMaveColor(value) {
    var v = parseFloat(value);
    if (isNaN(v)) return 'transparent';
    if (v < 30) return '#fecaca'; // red - severely reduced
    if (v < 50) return '#fed7aa'; // orange - moderately reduced
    if (v < 80) return '#fef9c3'; // yellow - mildly reduced
    return '#dcfce7'; // green - normal
}

function initTable() {
    // Show loading state
    $('#quick-stats').html('<div class="text-muted">Loading variant data...</div>').show();
    
    $.ajax({
        url: '/KCNH2/api/variants/',
        dataType: 'json',
        success: function(response) {
            createDataTable(response.data);
        },
        error: function(xhr, status, error) {
            console.error('Failed to load variant data:', error);
            $('#quick-stats').html('<div class="text-danger">Error loading data. Please refresh.</div>');
            $(".lds-dual-ring").remove();
        }
    });
}

function createDataTable(rawData) {
    $('#example').show();
    
    let table = $('#example').DataTable({
        data: rawData,
        order: [0, 'desc'],
        orderClasses: true,
        scrollY: '60vh',           // Use viewport height for responsive sizing
        scrollCollapse: true,
        scroller: {
            loadingIndicator: false,
            displayBuffer: 30      // Render 30 rows above/below viewport
        },
        deferRender: true,         // Only render visible rows - huge performance boost
        paging: true,              // Required for scroller
        pageLength: 50,            // Fallback if scroller fails
        responsive: false,         // Disable - conflicts with scroller
        buttons: [
            {
                extend: 'csvHtml5',
                text: 'Export CSV',
                exportOptions: { columns: ':visible' }
            },
            'colvis',
            'searchBuilder',
            'searchPanes'
        ],
        dom: 'Bfrtip',             // Added 'r' for processing indicator, 'p' for pagination fallback
        columns: [
            { data: 0, title: 'Ch.7' },           // pos
            { data: 1, title: 'HGVSc' },          // hgvsc_short
            {                                      // Variant link
                data: null,
                title: 'Variant',
                render: function(data, type, row) {
                    if (type === 'display') {
                        return '<a href="/KCNH2/variantinfo/' + row[2] + '" target="_blank">' + row[3] + '</a>';
                    }
                    return row[3]; // For sorting/filtering, use the variant text
                }
            },
            { data: 4, title: 'Residue Number' }, // resnum
            { data: 5, title: 'LQT2' },           // lqt2
            { data: 6, title: 'Lit/Cohort' },     // lit_cohort
            { data: 7, title: 'gnomAD' },         // gnomad
            { data: 8, title: 'MAVE Function' },  // mave_score
            { data: 9, title: 'Location' },       // structure
            { data: 10, title: 'LQT2 Penetrance(%)' } // p_pct
        ],
        columnDefs: [
            {
                // Color-code penetrance column
                targets: 9, // LQT2 Penetrance column (0-indexed in display)
                createdCell: function(td, cellData, rowData, row, col) {
                    $(td).css('background-color', getPenetranceColor(cellData));
                    $(td).css('font-weight', '600');
                }
            },
            {
                // Color-code MAVE function column - lower is worse
                targets: 7, // MAVE Function column
                createdCell: function(td, cellData, rowData, row, col) {
                    $(td).css('background-color', getMaveColor(cellData));
                }
            },
            {
                // Hide the full hgvsc and var_short columns (used only for link generation)
                targets: [],
                visible: false
            }
        ]
    }).on('search.dt', function() {
        tableActions(table);
    });
    
    $(".lds-dual-ring").remove();
    $('#quick-stats').show();
    tableActions(table);
}

function tableActions(table) {
    var lqt2 = [];
    var lit = [];
    var gnomad = [];
    var tot = [];
    var p_lqt2 = [];

    table.rows({filter: 'applied'}).every(function() {
        var data = this.data();
        lqt2.push(parseInt(data[5]) || 0);      // lqt2 is index 5 in raw data
        var litCount = parseInt(data[6]) || 0;
        var gnomadCount = parseInt(data[7]) || 0;
        lit.push(litCount);
        gnomad.push(gnomadCount);
        tot.push(litCount + gnomadCount);
        p_lqt2.push(parseFloat(data[10]) || 0);  // penetrance is index 10
    });

    // Update quick stats banner
    var totalVariants = table.rows().count();
    var filteredVariants = p_lqt2.length;
    var meanPenetrance = p_lqt2.length > 0 ? (p_lqt2.reduce((a, b) => a + b, 0) / p_lqt2.length).toFixed(1) : 0;
    var minPen = p_lqt2.length > 0 ? Math.min(...p_lqt2).toFixed(0) : 0;
    var maxPen = p_lqt2.length > 0 ? Math.max(...p_lqt2).toFixed(0) : 0;
    var totalLQT2 = lqt2.reduce((a, b) => a + b, 0);
    var totalLit = lit.reduce((a, b) => a + b, 0);
    var totalGnomad = gnomad.reduce((a, b) => a + b, 0);
    
    var statsHtml = '<div class="d-flex flex-wrap gap-3 justify-content-center align-items-center">' +
        '<span class="badge bg-primary fs-6">' + filteredVariants + ' of ' + totalVariants + ' variants</span>' +
        '<span class="badge bg-secondary fs-6">Mean penetrance: ' + meanPenetrance + '%</span>' +
        '<span class="badge bg-light text-dark fs-6">Range: ' + minPen + '% – ' + maxPen + '%</span>' +
        '<span class="badge bg-info fs-6">' + totalLQT2.toLocaleString() + ' LQT2 carriers</span>' +
        '<span class="badge bg-light text-dark fs-6">' + totalLit.toLocaleString() + ' lit/cohort carriers</span>' +
        '<span class="badge bg-light text-dark fs-6">' + totalGnomad.toLocaleString() + ' gnomAD carriers</span>' +
        '</div>';
    
    $('#quick-stats').html(statsHtml);
    
    // LQT2 carriers histogram
    VBCharts.carrierHistogram('myDiv', lqt2, '', 'LQT2 carriers per variant', {
        color: VBCharts.colors.primary
    });

    // Total carriers histogram
    VBCharts.totalCarriersHistogram('myDiv2', tot, '', {
        color: VBCharts.colors.secondary
    });

    // Penetrance histogram
    VBCharts.penetranceHistogram('myDiv3', p_lqt2, '', {
        color: VBCharts.colors.accent
    });
}

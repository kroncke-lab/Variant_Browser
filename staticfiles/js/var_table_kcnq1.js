/**
 * KCNQ1 Variant Table with AJAX Data Loading
 *
 * Data is loaded via AJAX from /KCNQ1/api/variants/ as JSON.
 * This is ~5x smaller than HTML table markup and much faster to load.
 *
 * Column mapping from API:
 * [0] pos - Ch.11 position
 * [1] hgvsc_short - truncated HGVSc for display
 * [2] hgvsc_full - full HGVSc for variant link
 * [3] var_short - truncated variant for display
 * [4] resnum - Residue Number
 * [5] lqt1 - LQT1 count
 * [6] lit_cohort - Lit/Cohort carriers
 * [7] gnomad - gnomAD carriers
 * [8] function - Function
 * [9] structure - Location
 * [10] lqt1_pct - LQT1 Penetrance %
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

function initTable() {
    // Show loading state
    $('#quick-stats').html('<div class="text-muted">Loading variant data...</div>').show();

    $.ajax({
        url: '/KCNQ1/api/variants/',
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
        order: [0, 'asc'],
        orderClasses: true,
        scrollX: true,
        scrollY: '60vh',
        scrollCollapse: true,
        scroller: {
            loadingIndicator: false,
            displayBuffer: 30
        },
        deferRender: true,
        paging: true,
        pageLength: 50,
        responsive: false,
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
        dom: 'Bfrtip',
        columns: [
            { data: 0, title: 'Ch.11' },
            { data: 1, title: 'HGVSc' },
            {
                data: null,
                title: 'Variant',
                render: function(data, type, row) {
                    if (type === 'display') {
                        return '<a href="/KCNQ1/variantinfo/' + row[2] + '" target="_blank">' + row[3] + '</a>';
                    }
                    return row[3];
                }
            },
            { data: 4, title: 'Residue Number' },
            { data: 5, title: 'LQT1' },
            { data: 6, title: 'Lit/Cohort' },
            { data: 7, title: 'gnomAD' },
            { data: 8, title: 'Function' },
            { data: 9, title: 'Location (LQT1)' },
            { data: 10, title: 'LQT1 Penetrance(%)' }
        ],
        columnDefs: [
            {
                // Color-code LQT1 penetrance column
                targets: 9,
                createdCell: function(td, cellData, rowData, row, col) {
                    $(td).css('background-color', getPenetranceColor(cellData));
                    $(td).css('font-weight', '600');
                }
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
    var lqt1 = [];
    var lit = [];
    var gnomad = [];
    var tot = [];
    var p_lqt1 = [];

    table.rows({filter: 'applied'}).every(function() {
        var data = this.data();
        var lqt1Count = parseInt(data[5]) || 0;
        var litCount = parseInt(data[6]) || 0;
        var gnomadCount = parseInt(data[7]) || 0;
        lqt1.push(lqt1Count);
        lit.push(litCount);
        gnomad.push(gnomadCount);
        tot.push(litCount + gnomadCount);
        p_lqt1.push(parseFloat(data[10]) || 0);
    });

    // Update quick stats banner
    var totalVariants = table.rows().count();
    var filteredVariants = p_lqt1.length;
    var meanPenetrance = p_lqt1.length > 0 ? (p_lqt1.reduce((a, b) => a + b, 0) / p_lqt1.length).toFixed(1) : 0;
    var minPen = p_lqt1.length > 0 ? Math.min(...p_lqt1).toFixed(0) : 0;
    var maxPen = p_lqt1.length > 0 ? Math.max(...p_lqt1).toFixed(0) : 0;
    var totalLQT1 = lqt1.reduce((a, b) => a + b, 0);
    var totalLit = lit.reduce((a, b) => a + b, 0);
    var totalGnomad = gnomad.reduce((a, b) => a + b, 0);

    var statsHtml = '<div class="d-flex flex-wrap gap-3 justify-content-center align-items-center">' +
        '<span class="badge bg-primary fs-6">' + filteredVariants + ' of ' + totalVariants + ' variants</span>' +
        '<span class="badge bg-secondary fs-6">Mean penetrance: ' + meanPenetrance + '%</span>' +
        '<span class="badge bg-light text-dark fs-6">Range: ' + minPen + '% – ' + maxPen + '%</span>' +
        '<span class="badge bg-info fs-6">' + totalLQT1.toLocaleString() + ' LQT1 carriers</span>' +
        '<span class="badge bg-light text-dark fs-6">' + totalLit.toLocaleString() + ' lit/cohort carriers</span>' +
        '<span class="badge bg-light text-dark fs-6">' + totalGnomad.toLocaleString() + ' gnomAD carriers</span>' +
        '</div>';

    $('#quick-stats').html(statsHtml);

    // LQT1 carriers histogram
    VBCharts.carrierHistogram('myDiv', lqt1, '', 'LQT1 carriers per variant', {
        color: VBCharts.colors.primary
    });

    // Total carriers histogram
    VBCharts.totalCarriersHistogram('myDiv2', tot, '', {
        color: VBCharts.colors.secondary
    });

    // Penetrance histogram
    VBCharts.penetranceHistogram('myDiv3', p_lqt1, '', {
        color: VBCharts.colors.accent
    });
}

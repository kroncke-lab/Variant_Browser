/**
 * RYR2 Variant Table with AJAX Data Loading
 *
 * Data is loaded via AJAX from /RyR2/api/variants/ as JSON.
 * This is ~5x smaller than HTML table markup and much faster to load.
 *
 * Column mapping from API:
 * [0] grch38_pos - Ch.1 position (grch38)
 * [1] var - Variant
 * [2] resnum - Residue Number
 * [3] cpvt - CPVT count
 * [4] lit_cohort - Lit/Cohort carriers
 * [5] unaff - Unaffected carriers
 * [6] hotspot - Hotspot
 * [7] cpvt_pct - CPVT Penetrance %
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
        url: '/RyR2/api/variants/',
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
        autoWidth: false,
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
            { data: 0, title: 'Ch.1 (grch38)' },
            { data: 1, title: 'Variant' },
            { data: 2, title: 'Residue Number' },
            { data: 3, title: 'CPVT' },
            { data: 4, title: 'Lit/Cohort' },
            { data: 5, title: 'Unaffected' },
            { data: 6, title: 'Hotspot' },
            { data: 7, title: 'CPVT Penetrance(%)' }
        ],
        columnDefs: [
            {
                // Color-code CPVT penetrance column
                targets: 7,
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
    var cpvt = [];
    var lit = [];
    var unaff = [];
    var p_cpvt = [];

    table.rows({filter: 'applied'}).every(function() {
        var data = this.data();
        var cpvtCount = parseInt(data[3]) || 0;
        var litCount = parseInt(data[4]) || 0;
        var unaffCount = parseInt(data[5]) || 0;
        cpvt.push(cpvtCount);
        lit.push(litCount);
        unaff.push(unaffCount);
        p_cpvt.push(parseFloat(data[7]) || 0);
    });

    // Update quick stats banner
    var totalVariants = table.rows().count();
    var filteredVariants = p_cpvt.length;
    var meanPenetrance = p_cpvt.length > 0 ? (p_cpvt.reduce((a, b) => a + b, 0) / p_cpvt.length).toFixed(1) : 0;
    var minPen = p_cpvt.length > 0 ? Math.min(...p_cpvt).toFixed(0) : 0;
    var maxPen = p_cpvt.length > 0 ? Math.max(...p_cpvt).toFixed(0) : 0;
    var totalCPVT = cpvt.reduce((a, b) => a + b, 0);
    var totalLit = lit.reduce((a, b) => a + b, 0);
    var totalUnaff = unaff.reduce((a, b) => a + b, 0);

    var statsHtml = '<div class="d-flex flex-wrap gap-3 justify-content-center align-items-center">' +
        '<span class="badge bg-primary fs-6">' + filteredVariants + ' of ' + totalVariants + ' variants</span>' +
        '<span class="badge bg-secondary fs-6">Mean penetrance: ' + meanPenetrance + '%</span>' +
        '<span class="badge bg-light text-dark fs-6">Range: ' + minPen + '% – ' + maxPen + '%</span>' +
        '<span class="badge bg-info fs-6">' + totalCPVT.toLocaleString() + ' CPVT carriers</span>' +
        '<span class="badge bg-light text-dark fs-6">' + totalLit.toLocaleString() + ' lit/cohort carriers</span>' +
        '<span class="badge bg-light text-dark fs-6">' + totalUnaff.toLocaleString() + ' unaffected carriers</span>' +
        '</div>';

    $('#quick-stats').html(statsHtml);

    // CPVT carriers histogram
    VBCharts.carrierHistogram('myDiv', cpvt, '', 'CPVT carriers per variant', {
        color: VBCharts.colors.primary
    });

    // Unaffected carriers histogram
    VBCharts.totalCarriersHistogram('myDiv2', unaff, '', {
        color: VBCharts.colors.secondary
    });

    // Penetrance histogram
    VBCharts.penetranceHistogram('myDiv3', p_cpvt, '', {
        color: VBCharts.colors.accent
    });
}

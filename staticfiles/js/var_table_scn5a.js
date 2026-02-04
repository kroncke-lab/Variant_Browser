/**
 * SCN5A Variant Table with AJAX Data Loading
 *
 * Data is loaded via AJAX from /SCN5A/api/variants/ as JSON.
 * This is ~5x smaller than HTML table markup and much faster to load.
 *
 * Column mapping from API:
 * [0] pos - Ch.3 position
 * [1] hgvsc_short - truncated HGVSc for display
 * [2] hgvsc_full - full HGVSc for variant link
 * [3] var_short - truncated variant for display
 * [4] resnum - Residue Number
 * [5] lqt3 - LQT3 count
 * [6] brs1 - BrS1 count
 * [7] lit_cohort - Lit/Cohort carriers
 * [8] gnomad - gnomAD carriers
 * [9] function - Function
 * [10] structure - Location
 * [11] lqt3_pct - LQT3 Penetrance %
 * [12] brs1_pct - BrS1 Penetrance %
 */

let chartsEnabled = false;
let chartsPlaceholderSet = false;
let serverStats = null;  // Store server-computed statistics

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
        url: '/SCN5A/api/variants/',
        dataType: 'json',
        success: function(response) {
            serverStats = response.stats || null;
            createDataTable(response.data);
        },
        error: function(xhr, status, error) {
            console.error('Failed to load variant data:', error);
            $('#table-loader').hide();
            $('#quick-stats').html('<div class="text-danger">Error loading data. Please refresh.</div>').show();
        }
    });
}

function createDataTable(rawData) {
    $('#example').show();
    $('#table-loader').hide();  // Hide loader once data arrives

    let table = $('#example').DataTable({
        data: rawData,
        order: [[0, 'desc']],
        orderClasses: true,
        scrollX: true,
        scrollY: '60vh',
        scrollCollapse: true,
        scroller: {
            loadingIndicator: false,  // Disable scroller's loading indicator
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
            { data: 0, title: 'Ch.3' },
            { data: 1, title: 'HGVSc' },
            {
                data: null,
                title: 'Variant',
                render: function(data, type, row) {
                    if (type === 'display') {
                        return '<a href="/SCN5A/variantinfo/' + row[2] + '" target="_blank">' + row[3] + '</a>';
                    }
                    return row[3];
                }
            },
            { data: 4, title: 'Residue Number' },
            { data: 5, title: 'LQT3' },
            { data: 6, title: 'BrS1' },
            { data: 7, title: 'Lit/Cohort' },
            { data: 8, title: 'gnomAD' },
            { data: 9, title: 'Function' },
            { data: 10, title: 'Location' },
            { data: 11, title: 'LQT3 Penetrance(%)' },
            { data: 12, title: 'BrS1 Penetrance(%)' }
        ],
        columnDefs: [
            {
                // Color-code LQT3 penetrance column
                targets: 10,
                createdCell: function(td, cellData, rowData, row, col) {
                    $(td).css('background-color', getPenetranceColor(cellData));
                    $(td).css('font-weight', '600');
                }
            },
            {
                // Color-code BrS1 penetrance column
                targets: 11,
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
    $('#table-loader').hide();
    $('#quick-stats').show();
    tableActions(table);
}

function tableActions(table) {
    var brs1 = [];
    var lqt3 = [];
    var lit = [];
    var gnomad = [];
    var unaff = [];
    var p_brs1 = [];
    var p_lqt3 = [];

    table.rows({filter: 'applied'}).every(function() {
        var data = this.data();
        var lqt3Count = parseInt(data[5]) || 0;
        var brs1Count = parseInt(data[6]) || 0;
        var litCount = parseInt(data[7]) || 0;
        var gnomadCount = parseInt(data[8]) || 0;
        var totalCarriers = litCount + gnomadCount;
        var unaffCount = Math.max(totalCarriers - lqt3Count - brs1Count, 0);
        lqt3.push(lqt3Count);
        brs1.push(brs1Count);
        lit.push(litCount);
        gnomad.push(gnomadCount);
        unaff.push(unaffCount);
        p_brs1.push(parseFloat(data[12]) || 0);
        p_lqt3.push(parseFloat(data[11]) || 0);
    });

    // Update quick stats banner
    var totalVariants = table.rows().count();
    var filteredVariants = p_lqt3.length;

    // Use server stats for totals, calculate mean from visible data
    var totalBrs1, totalLqt3, totalLit, totalGnomad;
    if (serverStats && filteredVariants === totalVariants) {
        // Use server stats when showing all data
        totalBrs1 = serverStats.totalBrs1 || 0;
        totalLqt3 = serverStats.totalLqt3 || 0;
        totalLit = serverStats.totalLit || 0;
        totalGnomad = serverStats.totalGnomad || 0;
    } else {
        // Calculate from filtered data
        totalBrs1 = brs1.reduce((a, b) => a + b, 0);
        totalLqt3 = lqt3.reduce((a, b) => a + b, 0);
        totalLit = lit.reduce((a, b) => a + b, 0);
        totalGnomad = gnomad.reduce((a, b) => a + b, 0);
    }

    var meanBrs1Pen = p_brs1.length > 0 ? (p_brs1.reduce((a, b) => a + b, 0) / p_brs1.length).toFixed(1) : 0;
    var meanLqt3Pen = p_lqt3.length > 0 ? (p_lqt3.reduce((a, b) => a + b, 0) / p_lqt3.length).toFixed(1) : 0;

    var statsHtml = '<div class="d-flex flex-wrap gap-3 justify-content-center align-items-center">' +
        '<span class="badge bg-primary fs-6">' + filteredVariants.toLocaleString() + ' of ' + totalVariants.toLocaleString() + ' variants</span>' +
        '<span class="badge bg-danger fs-6">BrS1: ' + meanBrs1Pen + '% mean</span>' +
        '<span class="badge bg-warning text-dark fs-6">LQT3: ' + meanLqt3Pen + '% mean</span>' +
        '<span class="badge bg-info fs-6">' + totalBrs1.toLocaleString() + ' BrS1 carriers</span>' +
        '<span class="badge bg-info fs-6">' + totalLqt3.toLocaleString() + ' LQT3 carriers</span>' +
        '<span class="badge bg-light text-dark fs-6">' + totalLit.toLocaleString() + ' lit/cohort carriers</span>' +
        '<span class="badge bg-light text-dark fs-6">' + totalGnomad.toLocaleString() + ' gnomAD carriers</span>' +
        '</div>';

    $('#quick-stats').html(statsHtml);

    if (!chartsEnabled) {
        if (!chartsPlaceholderSet) {
            var placeholder = '<div class="d-flex align-items-center justify-content-center h-100 text-muted"><span>Click "Enable Charts" to load</span></div>';
            $('#myDiv1, #myDiv2, #myDiv3, #myDiv4, #myDiv5').html(placeholder);
            $('#scn5a-chart-toggle').show();
            $('#chart-status').text('Charts paused for performance.');
            chartsPlaceholderSet = true;
        }
        return;
    }

    $('#scn5a-chart-toggle').hide();
    $('#chart-status').text('');

    // BrS1 carriers histogram
    VBCharts.carrierHistogram('myDiv1', brs1, '', 'BrS1 carriers per variant', {
        color: VBCharts.colors.danger
    });

    // LQT3 carriers histogram
    VBCharts.carrierHistogram('myDiv2', lqt3, '', 'LQT3 carriers per variant', {
        color: VBCharts.colors.warning
    });

    // Unaffected carriers histogram
    VBCharts.totalCarriersHistogram('myDiv3', unaff, '', {
        color: VBCharts.colors.secondary
    });

    // BrS1 penetrance histogram
    VBCharts.penetranceHistogram('myDiv4', p_brs1, '', {
        color: VBCharts.colors.danger
    });

    // LQT3 penetrance histogram
    VBCharts.penetranceHistogram('myDiv5', p_lqt3, '', {
        color: VBCharts.colors.warning
    });
}

$(document).on('click', '#scn5a-chart-toggle', function() {
    chartsEnabled = true;
    chartsPlaceholderSet = false;
    // Trigger a redraw to populate charts with current page/filter
    $('#example').DataTable().draw(false);
});

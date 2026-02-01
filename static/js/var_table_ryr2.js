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
    const $table = $('#example');

    $table.one('init.dt', function() {
        $(".lds-dual-ring").remove();
        $('#quick-stats').show();
        $table.fadeIn('fast');
    });

    var table = $table.DataTable({
        order: [[0, 'desc']],
        orderClasses: true,
        deferRender: true,
        responsive: true,
        pageLength: 50,
        lengthMenu: [
            [25, 50, 100, -1],
            [25, 50, 100, 'All']
        ],
        buttons: [
            'searchBuilder',
            'searchPanes'
        ],
        dom: "<'row align-items-center mb-3'<'col-md-6 d-flex gap-2'B><'col-md-6 text-md-end'f>>" +
             "<'row'<'col-12'tr>>" +
             "<'row mt-3'<'col-md-6'i><'col-md-6'p>>",
        language: {
            loadingRecords: 'Loading RYR2 variants…'
        },
        columnDefs: [
            {
                // Color-code CPVT penetrance column (column 6)
                targets: 6,
                createdCell: function(td, cellData, rowData, row, col) {
                    $(td).css('background-color', getPenetranceColor(cellData));
                    $(td).css('font-weight', '600');
                }
            }
        ]
    });

    // Update stats on filter change
    table.on('search.dt', function() {
        updateStats(table);
    });
    
    // Initial stats update
    updateStats(table);
}

function updateStats(table) {
    var cpvt = [];
    var tot = [];
    var p_cpvt = [];

    table.rows({filter: 'applied'}).every(function() {
        var data = this.data();
        cpvt.push(parseInt(data[3]) || 0);
        tot.push(parseInt(data[4]) || 0);
        p_cpvt.push(parseFloat(data[6]) || 0);
    });

    var totalVariants = table.rows().count();
    var filteredVariants = p_cpvt.length;
    var meanPenetrance = p_cpvt.length > 0 ? (p_cpvt.reduce((a, b) => a + b, 0) / p_cpvt.length).toFixed(1) : 0;
    var minPen = p_cpvt.length > 0 ? Math.min(...p_cpvt).toFixed(0) : 0;
    var maxPen = p_cpvt.length > 0 ? Math.max(...p_cpvt).toFixed(0) : 0;
    var totalCPVT = cpvt.reduce((a, b) => a + b, 0);
    var totalCarriers = tot.reduce((a, b) => a + b, 0);
    
    var statsHtml = '<div class="d-flex flex-wrap gap-3 justify-content-center align-items-center">' +
        '<span class="badge bg-primary fs-6">' + filteredVariants + ' of ' + totalVariants + ' variants</span>' +
        '<span class="badge bg-secondary fs-6">Mean penetrance: ' + meanPenetrance + '%</span>' +
        '<span class="badge bg-light text-dark fs-6">Range: ' + minPen + '% – ' + maxPen + '%</span>' +
        '<span class="badge bg-info fs-6">' + totalCPVT.toLocaleString() + ' CPVT carriers</span>' +
        '<span class="badge bg-light text-dark fs-6">' + totalCarriers.toLocaleString() + ' total carriers</span>' +
        '</div>';
    
    $('#quick-stats').html(statsHtml);
}
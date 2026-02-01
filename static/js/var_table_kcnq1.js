
$(document).ready( function() {
    initTable();

} );

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

function initTable () {

    $('#example').show();

    let table = $('#example').DataTable( {
        order: [ 0, 'desc' ],
        orderClasses: true,
        scrollY: 400,
        scroller: true,
        responsive: true,
        buttons: [
            'searchBuilder',
            'searchPanes'
        ],
        dom: 'Bfti',
        columnDefs: [
            {
                // Color-code penetrance column (column 8)
                targets: 8,
                createdCell: function(td, cellData, rowData, row, col) {
                    $(td).css('background-color', getPenetranceColor(cellData));
                    $(td).css('font-weight', '600');
                }
            }
        ]
    }).on('search.dt', function () {
    tableActions(table);
});
    $(".lds-dual-ring").remove();
    $('#quick-stats').show();
     tableActions(table);
}



function tableActions (table) {
    var lqt1 = [];
    var tot = [];
    var p_lqt1 = [];

    table.rows({filter: 'applied'}).every( function() {
        var data = this.data();
        lqt1.push(parseInt(data[5]) || 0);
        tot.push(parseInt(data[4]) || 0);
        p_lqt1.push(parseFloat(data[8]) || 0);
    });

    // Update quick stats banner
    var totalVariants = table.rows().count();
    var filteredVariants = p_lqt1.length;
    var meanPenetrance = p_lqt1.length > 0 ? (p_lqt1.reduce((a, b) => a + b, 0) / p_lqt1.length).toFixed(1) : 0;
    var minPen = p_lqt1.length > 0 ? Math.min(...p_lqt1).toFixed(0) : 0;
    var maxPen = p_lqt1.length > 0 ? Math.max(...p_lqt1).toFixed(0) : 0;
    var totalLQT1 = lqt1.reduce((a, b) => a + b, 0);
    var totalCarriers = tot.reduce((a, b) => a + b, 0);
    
    var statsHtml = '<div class="d-flex flex-wrap gap-3 justify-content-center align-items-center">' +
        '<span class="badge bg-primary fs-6">' + filteredVariants + ' of ' + totalVariants + ' variants</span>' +
        '<span class="badge bg-secondary fs-6">Mean penetrance: ' + meanPenetrance + '%</span>' +
        '<span class="badge bg-light text-dark fs-6">Range: ' + minPen + '% – ' + maxPen + '%</span>' +
        '<span class="badge bg-info fs-6">' + totalLQT1.toLocaleString() + ' LQT1 carriers</span>' +
        '<span class="badge bg-light text-dark fs-6">' + totalCarriers.toLocaleString() + ' total carriers</span>' +
        '</div>';
    
    $('#quick-stats').html(statsHtml);
    var trace = {
      x: lqt1,
      type: 'histogram',
      xbins: {
        size: 1,
        start: 1
      }
    };
    let layout = {
        xaxis: {
            title: "Number of KCNQ1 variant carriers diagnosed with LQTS",
            range: [1,]
        },
        yaxis: {
            title: "Number of unique KCNQ1 variants",
            autorange: true
        }
    };
    var data = [trace];
    Plotly.newPlot('myDiv', data, layout);

    var trace2 = {
        x: tot,
        type: 'histogram',
        autobinx: false,
        xbins: {
            end: 300,
            size: 2,
            start: 1
        }
    };
    var layout2 = {
        xaxis: {
            title: "Number of carriers for each KCNQ1 variant",
            range: [1,300],
        },
        yaxis: {
            title: "Number of unique KCNQ1 variants",
            type: 'log',
            autorange: true
    }
    };
    var data2 = [trace2];
    Plotly.newPlot('myDiv2', data2, layout2);

    var trace3 = {
        x: p_lqt1,
        type: 'histogram',
        autobinx: false,
        xbins: {
            end: 100,
            size: 10,
            start: 0
        }
    };
    var layout3 = {
        xaxis: {
            title: "LQT1 Penetrance Estimate (%)",
            range: [0,100],
        },
        yaxis: {
            title: "Number of unique KCNQ1 variants",
            autorange: true
    }
    };
    var data3 = [trace3];
    Plotly.newPlot('myDiv3', data3, layout3);
}



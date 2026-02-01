
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
        order: [ 0, 'asc' ],
        orderClasses: true,
        scrollX: true,
        scrollY: 400,
        scroller: true,
        buttons: [
            'searchBuilder',
            'searchPanes'
        ],
        dom: 'Bfti',
        columnDefs: [
            {
                // Color-code LQT3 penetrance column (column 9)
                targets: 9,
                createdCell: function(td, cellData, rowData, row, col) {
                    $(td).css('background-color', getPenetranceColor(cellData));
                    $(td).css('font-weight', '600');
                }
            },
            {
                // Color-code BrS1 penetrance column (column 10)
                targets: 10,
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
    var brs1 = [];
    var lqt3 = [];
    var unaff = [];
    var p_brs1 = [];
    var p_lqt3 = [];

    table.rows({filter: 'applied'}).every( function() {
        var data = this.data();
        brs1.push(parseInt(data[5]) || 0);
        lqt3.push(parseInt(data[4]) || 0);
        unaff.push(parseInt(data[6]) || 0);
        p_brs1.push(parseFloat(data[10]) || 0);
        p_lqt3.push(parseFloat(data[9]) || 0);
    });

    // Update quick stats banner
    var totalVariants = table.rows().count();
    var filteredVariants = p_brs1.length;
    var meanBrs1Pen = p_brs1.length > 0 ? (p_brs1.reduce((a, b) => a + b, 0) / p_brs1.length).toFixed(1) : 0;
    var meanLqt3Pen = p_lqt3.length > 0 ? (p_lqt3.reduce((a, b) => a + b, 0) / p_lqt3.length).toFixed(1) : 0;
    var totalBrs1 = brs1.reduce((a, b) => a + b, 0);
    var totalLqt3 = lqt3.reduce((a, b) => a + b, 0);
    var totalCarriers = unaff.reduce((a, b) => a + b, 0);
    
    var statsHtml = '<div class="d-flex flex-wrap gap-3 justify-content-center align-items-center">' +
        '<span class="badge bg-primary fs-6">' + filteredVariants + ' of ' + totalVariants + ' variants</span>' +
        '<span class="badge bg-danger fs-6">BrS1: ' + meanBrs1Pen + '% mean</span>' +
        '<span class="badge bg-warning text-dark fs-6">LQT3: ' + meanLqt3Pen + '% mean</span>' +
        '<span class="badge bg-info fs-6">' + totalBrs1.toLocaleString() + ' BrS1 carriers</span>' +
        '<span class="badge bg-info fs-6">' + totalLqt3.toLocaleString() + ' LQT3 carriers</span>' +
        '<span class="badge bg-light text-dark fs-6">' + totalCarriers.toLocaleString() + ' total carriers</span>' +
        '</div>';
    
    $('#quick-stats').html(statsHtml);
    var trace = {
      x: brs1,
      type: 'histogram',
      xbins: {
        size: 1,
        start: 1
      }
    };
    let layout = {
        xaxis: {
            title: "Number of SCN5A variant carriers diagnosed with BrS1",
            range: [1,]
        },
        yaxis: {
            title: "Number of unique SCN5A variants",
            autorange: true
        }
    };
    var data = [trace];
    Plotly.newPlot('myDiv1', data, layout);

    var trace2 = {
      x: lqt3,
      type: 'histogram',
      xbins: {
        size: 1,
        start: 1
      }
    };
    let layout2 = {
        xaxis: {
            title: "Number of SCN5A variant carriers diagnosed with LQT3",
            range: [1,]
        },
        yaxis: {
            title: "Number of unique SCN5A variants",
            autorange: true
        }
    };
    var data2 = [trace2];
    Plotly.newPlot('myDiv2', data2, layout2);

    var trace3 = {
        x: unaff,
        type: 'histogram',
        autobinx: false,
        xbins: {
            end: 300,
            size: 2,
            start: 1
        }
    };
    var layout3 = {
        xaxis: {
            title: "Number of unaffected carriers for each SCN5A variant",
            range: [1,300],
        },
        yaxis: {
            title: "Number of unique SCN5A variants",
            type: 'log',
            autorange: true
    }
    };
    var data3 = [trace3];
    Plotly.newPlot('myDiv3', data3, layout3);

    var trace4 = {
        x: p_brs1,
        type: 'histogram',
        autobinx: false,
        xbins: {
            end: 100,
            size: 10,
            start: 0
        }
    };
    var layout4 = {
        xaxis: {
            title: "BrS1 Penetrance Estimate (%)",
            range: [0,100],
        },
        yaxis: {
            title: "Number of unique SCN5A variants",
            autorange: true
    }
    };
    var data4 = [trace4];
    Plotly.newPlot('myDiv4', data4, layout4);

    var trace5 = {
        x: p_lqt3,
        type: 'histogram',
        autobinx: false,
        xbins: {
            end: 100,
            size: 10,
            start: 0
        }
    };
    var layout5 = {
        xaxis: {
            title: "LQT3 Penetrance Estimate (%)",
            range: [0,100],
        },
        yaxis: {
            title: "Number of unique SCN5A variants",
            autorange: true
    }
    };
    var data5 = [trace5];
    Plotly.newPlot('myDiv5', data5, layout5);
}


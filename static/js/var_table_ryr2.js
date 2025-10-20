$(document).ready(function() {
    initTable();
    tableActions();
});

function initTable() {
    let $table = $('#example');

    // Use capital D in DataTable
    let table = $table.DataTable({
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
        }
    });
    
    // Show the table and remove loading spinner
    $table.show();
    $('.lds-dual-ring').remove();
    
    return table;
}  // <-- This closing brace was missing!

function tableActions(table) {
    var cpvt = [];
    var tot = [];
    var p_cpvt = [];
    
    // Get the table instance if not passed
    if (!table) {
        table = $('#example').DataTable();
    }

    table.rows({filter: 'applied'}).every(function() {
        var data = this.data();
        cpvt.push(data[3]);  // CPVT carriers
        tot.push(data[4]);   // Total carriers
        p_cpvt.push(data[6]); // CPVT penetrance
    });

    // Create histogram for CPVT carriers
    var trace1 = {
        x: cpvt,
        type: 'histogram',
        xbins: {
            size: 1,
            start: 1
        }
    };
    var layout1 = {
        xaxis: {
            title: "Number of RYR2 variant carriers diagnosed with CPVT",
            range: [1,]
        },
        yaxis: {
            title: "Number of unique RYR2 variants",
            autorange: true
        }
    };
    Plotly.newPlot('myDiv1', [trace1], layout1);

    // Create histogram for total carriers
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
            title: "Number of carriers for each RYR2 variant",
            range: [1, 300]
        },
        yaxis: {
            title: "Number of unique RYR2 variants",
            type: 'log',
            autorange: true
        }
    };
    Plotly.newPlot('myDiv2', [trace2], layout2);

    // Create histogram for penetrance
    var trace3 = {
        x: p_cpvt,
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
            title: "CPVT Penetrance Estimate (%)",
            range: [0, 100]
        },
        yaxis: {
            title: "Number of unique RYR2 variants",
            autorange: true
        }
    };
    Plotly.newPlot('myDiv3', [trace3], layout3);
}
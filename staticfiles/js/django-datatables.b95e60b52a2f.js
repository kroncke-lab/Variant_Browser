$(document).ready( function() {
    initTable();
    tableActions();
} );

function initTable () {
    let table = $('#testy').dataTable({
        ajax: {
            url: AJAX_URL,
        },
        processing: true,
        serverSide: true,
        searchable: true,
        searchPanes: {
            columns: [2, 5],
            layout: 'columns-2',
        },
        columnDefs: [{
            searchPanes: {
                show: true
            },
            targets: [0,1]
        }],
        dom: 'Pfrtip',
        columns: [
        { 'data': 'var' },
        { 'data': 'resnum' },
        { 'data': 'lqt2' },
        { 'data': 'structure' },
        { 'data': 'lqt2_dist' },
        { 'data': 'p_mean_w',
                            render: $.fn.dataTable.render.number(',', '.', 2, '$')
                        }],
    }).on('search.dt', function () {
        tableActions(table);
    });
}

function tableActions () {
    var lqt2 = [];
    var tot = [];
    var p_lqt2 = [];

    let table = $('#testy').DataTable();
    table.rows({filter: 'applied'}).every( function() {
        var data = this.data();
        lqt2.push(data[3]);
        tot.push(data[3]);
        p_lqt2.push(data[3])
    });
    var trace = {
      x: lqt2,
      type: 'histogram',
      xbins: {
        size: 1,
        start: 1
      }
    };
    let layout = {
        title: 'Histogram of KCNH2 Variant Carriers with LQTS',
        xaxis: {
            title: "Number of KCNH2 variant carriers diagnosed with LQTS",
            range: [1,]
        },
        yaxis: {
            title: "Number of unique KCNH2 variants (Log scale)",
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
            end: 100,
            size: 2,
            start: 1
        }
    };
    var layout2 = {
        title: 'Histogram of Total KCNH2 Variant Carriers',
        xaxis: {
            title: "Number of carriers for each KCNH2 variant",
            range: [1,100],
        },
        yaxis: {
            title: "Number of unique KCNH2 variants (Log scale)",
            type: 'log',
            autorange: true
    }
    };
    var data2 = [trace2];
    Plotly.newPlot('myDiv2', data2, layout2);

    var trace3 = {
        x: p_lqt2,
        type: 'histogram',
        autobinx: false,
        xbins: {
            end: 100,
            size: 5,
            start: 0
        }
    };
    var layout3 = {
        title: 'Histogram of KCNH2 Penetrance Estimates',
        xaxis: {
            title: "LQT2 Penetrance Estimate",
            range: [0,100],
        },
        yaxis: {
            title: "Number of unique KCNH2 variants",
            autorange: true
    }
    };
    var data3 = [trace3];
    Plotly.newPlot('myDiv3', data3, layout3);
}

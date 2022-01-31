
$(document).ready( function() {
    initTable();

} );

function initTable () {

    $('#example').show();

    let table = $('#example').DataTable( {
        order: [ 0, 'asc' ],
        orderClasses: true,
        scrollY: 400,
        scrollX: true,
        scroller: true,
        responsive: true,
        buttons: [
            'searchBuilder',
            'searchPanes'
        ],
        dom: 'Bfti'
    }).on('search.dt', function () {
    tableActions(table);
});
    $(".lds-dual-ring").remove();
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
        brs1.push(data[4]);
        lqt3.push(data[5]);
        unaff.push(data[6]);
        p_brs1.push(data[9])
        p_lqt3.push(data[11])
    });
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



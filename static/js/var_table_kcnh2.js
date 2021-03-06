
$(document).ready( function() {
    initTable();

} );

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
        dom: 'Bfti'
    }).on('search.dt', function () {
    tableActions(table);
});
    $(".lds-dual-ring").remove();
     tableActions(table);
}



function tableActions (table) {
    var lqt2 = [];
    var tot = [];
    var p_lqt2 = [];

    table.rows({filter: 'applied'}).every( function() {
        var data = this.data();
        lqt2.push(data[4]);
        tot.push(data[5]);
        p_lqt2.push(data[8])
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
        xaxis: {
            title: "Number of KCNH2 variant carriers diagnosed with LQTS",
            range: [1,]
        },
        yaxis: {
            title: "Number of unique KCNH2 variants",
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
            title: "Number of carriers for each KCNH2 variant",
            range: [1,300],
        },
        yaxis: {
            title: "Number of unique KCNH2 variants",
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
            size: 10,
            start: 0
        }
    };
    var layout3 = {
        xaxis: {
            title: "LQT2 Penetrance Estimate (%)",
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



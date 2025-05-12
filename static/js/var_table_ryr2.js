$(document).ready(function() {
    initTable();
});

function initTable() {
    $('#example').show();
    let table = $('#example').DataTable({
        order: [[0, 'desc']],
        orderClasses: true,
        scrollY: 400,
        scroller: true,
        responsive: true,
        buttons: [
            'searchBuilder',
            'searchPanes'
        ],
        dom: 'Bfti'
    }).on('search.dt', function() {
        tableActions(table);
    });
    $(".lds-dual-ring").remove();
    tableActions(table);
}

function tableActions(table) {
    var cpvt = [];
    var tot = [];
    var p_cpvt = [];

    table.rows({filter: 'applied'}).every(function() {
        var data = this.data();
        cpvt.push(data[4]);  // Number of RYR2 variant carriers diagnosed with CPVT
        tot.push(data[3]);   // Total number of carriers for each RYR2 variant
        p_cpvt.push(data[5]); // CPVT penetrance estimate
    });


}
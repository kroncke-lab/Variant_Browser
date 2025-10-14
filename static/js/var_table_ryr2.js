$(document).ready(function() {
    initTable();
});

function initTable() {
    const $table = $('#example');

    $table.one('init.dt', function() {
        $(".lds-dual-ring").remove();
        $table.fadeIn('fast');
    });

    $table.DataTable({
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
}
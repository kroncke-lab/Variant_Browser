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
        scrollY: '60vh',
        scroller: true,
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
        dom: 'Bfti',
        language: {
            loadingRecords: 'Loading RYR2 variants…'
        }
    });
}
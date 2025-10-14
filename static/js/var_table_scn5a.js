(function ($, Plotly, global) {
    global.scn5aTableReady = false;
    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function coerceNumber(value) {
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    }

    function buildHistogramConfig(xTitle, options = {}) {
        return {
            layout: Object.assign({
                margin: {t: 36, r: 16, b: 48, l: 56},
                bargap: 0.05,
                hovermode: 'x unified',
                xaxis: {title: xTitle, automargin: true},
                yaxis: {title: 'Number of variants', automargin: true}
            }, options.layout || {}),
            config: Object.assign({displaylogo: false, responsive: true}, options.config || {}),
            trace: Object.assign({type: 'histogram', autobinx: false, marker: {color: '#2563eb'}}, options.trace || {})
        };
    }

    function collectRowData(rows) {
        const carriersBrs1 = [];
        const carriersLqt3 = [];
        const carriersUnaffected = [];
        const penetranceBrs1 = [];
        const penetranceLqt3 = [];

        rows.each(function (row) {
            carriersBrs1.push(coerceNumber(row[4]));
            carriersLqt3.push(coerceNumber(row[5]));
            carriersUnaffected.push(coerceNumber(row[6]));
            penetranceBrs1.push(coerceNumber(row[9]));
            penetranceLqt3.push(coerceNumber(row[11]));
        });

        return {
            carriersBrs1,
            carriersLqt3,
            carriersUnaffected,
            penetranceBrs1,
            penetranceLqt3
        };
    }

    function initCharts() {
        const chartDefinitions = {
            myDiv1: buildHistogramConfig('Number of BrS1-diagnosed carriers', {
                layout: {xbins: {size: 1, start: 0.5}}
            }),
            myDiv2: buildHistogramConfig('Number of LQT3-diagnosed carriers', {
                layout: {xbins: {size: 1, start: 0.5}},
                trace: {marker: {color: '#f97316'}}
            }),
            myDiv3: buildHistogramConfig('Number of unaffected carriers', {
                layout: {xbins: {start: 0.5, end: 300.5, size: 2}, yaxis: {type: 'log'}},
                trace: {marker: {color: '#14b8a6'}}
            }),
            myDiv4: buildHistogramConfig('BrS1 penetrance (%)', {
                layout: {xbins: {start: -0.5, end: 100.5, size: 10}},
                trace: {marker: {color: '#0ea5e9'}}
            }),
            myDiv5: buildHistogramConfig('LQT3 penetrance (%)', {
                layout: {xbins: {start: -0.5, end: 100.5, size: 10}},
                trace: {marker: {color: '#7c3aed'}}
            })
        };

        Object.entries(chartDefinitions).forEach(([elementId, definition]) => {
            Plotly.newPlot(elementId, [Object.assign({}, definition.trace, {x: []})], definition.layout, definition.config);
        });

        return chartDefinitions;
    }

    function updateCharts(chartDefinitions, dataset) {
        const traces = {
            myDiv1: {x: dataset.carriersBrs1},
            myDiv2: {x: dataset.carriersLqt3},
            myDiv3: {x: dataset.carriersUnaffected},
            myDiv4: {x: dataset.penetranceBrs1},
            myDiv5: {x: dataset.penetranceLqt3}
        };

        Object.entries(traces).forEach(([elementId, trace]) => {
            const definition = chartDefinitions[elementId];
            Plotly.react(elementId, [Object.assign({}, definition.trace, trace)], definition.layout, definition.config);
        });
    }

    function initTable() {
        const chartDefinitions = initCharts();
        const table = $('#scn5a-table').DataTable({
            dom: 'Bfrtip',
            buttons: [
                'searchBuilder',
                'searchPanes',
                'copyHtml5',
                'csvHtml5'
            ],
            order: [[0, 'asc']],
            scrollX: true,
            deferRender: true,
            scroller: true,
            stateSave: true
        });

        const emitReady = () => {
            global.scn5aTableReady = true;
            document.dispatchEvent(new Event('table:ready'));
        };
        if (table.settings()[0].oFeatures.bServerSide) {
            table.one('draw', emitReady);
        } else {
            emitReady();
        }

        const refreshCharts = () => {
            const rows = table.rows({filter: 'applied'}).data();
            updateCharts(chartDefinitions, collectRowData(rows));
        };

        const debouncedRefresh = debounce(refreshCharts, 180);

        table.on('search.dt column-visibility.dt page.dt order.dt draw.dt', debouncedRefresh);

        refreshCharts();
    }

    $(document).ready(initTable);
})(jQuery, window.Plotly, window);

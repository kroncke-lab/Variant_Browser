/**
 * Shared Plotly Chart Theme for Variant Browser
 *
 * Clean, clinical aesthetic with card-based layout.
 * Charts have no internal titles - titles live in card headers.
 */

const VBCharts = {
    // Color palette - clean, clinical colors
    colors: {
        primary: '#3b82f6',      // Blue - for affected carriers
        secondary: '#14b8a6',    // Teal - for total/unaffected carriers
        accent: '#8b5cf6',       // Purple - for penetrance
        warning: '#f59e0b',      // Amber
        danger: '#ef4444',       // Red
        success: '#10b981',      // Green
        gradient: [
            '#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#10b981'
        ]
    },

    // Base layout - minimal, clean aesthetic
    baseLayout: {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'white',
        font: {
            family: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            size: 11,
            color: '#6b7280'  // Muted gray for labels
        },
        margin: { t: 20, r: 25, b: 50, l: 55 },  // Reduced top margin (no title)
        hoverlabel: {
            bgcolor: '#1f2937',
            bordercolor: '#1f2937',
            font: { color: 'white', size: 12 }
        },
        xaxis: {
            gridcolor: '#f3f4f6',      // Very light gridlines
            linecolor: '#e5e7eb',      // Subtle axis line
            linewidth: 1,
            tickfont: { size: 10, color: '#9ca3af' },
            title: { font: { size: 11, color: '#6b7280' }, standoff: 12 },
            zeroline: false
        },
        yaxis: {
            gridcolor: '#f3f4f6',      // Very light gridlines
            linecolor: '#e5e7eb',      // Subtle axis line
            linewidth: 1,
            tickfont: { size: 10, color: '#9ca3af' },
            title: { font: { size: 11, color: '#6b7280' }, standoff: 8 },
            zeroline: false
        }
    },

    // Plotly config - minimal toolbar
    config: {
        responsive: true,
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'zoomIn2d', 'zoomOut2d'],
        displaylogo: false
    },

    /**
     * Create a styled histogram trace - clean solid bars
     */
    histogramTrace: function(data, options = {}) {
        const color = options.color || this.colors.primary;
        return {
            x: data,
            type: 'histogram',
            marker: {
                color: color,
                line: {
                    color: color,  // Same color outline for clean look
                    width: 0.5
                },
                opacity: 0.9
            },
            hovertemplate: '<b>%{y}</b> variants<br>%{x}<extra></extra>',
            ...options.trace
        };
    },

    /**
     * Create a histogram with clean, minimal styling
     * No title in plot area - titles live in card headers
     */
    histogram: function(containerId, data, title, xLabel, options = {}) {
        const trace = this.histogramTrace(data, options);

        if (options.xbins) {
            trace.xbins = options.xbins;
            trace.autobinx = false;
        }

        const layout = {
            ...this.baseLayout,
            // No title - titles are in card headers
            xaxis: {
                ...this.baseLayout.xaxis,
                title: { text: xLabel, font: { size: 11, color: '#6b7280' }, standoff: 12 },
                range: options.xRange || null
            },
            yaxis: {
                ...this.baseLayout.yaxis,
                title: { text: options.yLabel || 'Variants', font: { size: 11, color: '#6b7280' }, standoff: 8 },
                type: options.logY ? 'log' : 'linear',
                tickmode: options.logY ? 'array' : 'auto',
                tickvals: options.logY ? [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000] : null,
                ticktext: options.logY ? ['1', '2', '5', '10', '20', '50', '100', '200', '500', '1k', '2k', '5k'] : null,
                autorange: true
            },
            bargap: 0.08,
            height: 280  // Consistent card height
        };

        Plotly.newPlot(containerId, [trace], layout, this.config);
    },

    /**
     * Create a penetrance histogram (0-100% range, log scale Y-axis)
     */
    penetranceHistogram: function(containerId, data, title, options = {}) {
        // Guard against empty data
        if (!data || data.length === 0) {
            document.getElementById(containerId).innerHTML = '<div class="text-muted text-center py-4">No data to display</div>';
            return;
        }
        this.histogram(containerId, data, title, 'Penetrance Estimate (%)', {
            color: options.color || this.colors.accent,
            xbins: { start: 0, end: 100, size: 5 },
            xRange: [0, 100],
            yLabel: 'Number of variants',
            logY: true,  // Use log scale for variant counts
            ...options
        });
    },

    /**
     * Create a carrier count histogram (log scale Y-axis by default)
     */
    carrierHistogram: function(containerId, data, title, xLabel, options = {}) {
        // Guard against empty data
        if (!data || data.length === 0) {
            document.getElementById(containerId).innerHTML = '<div class="text-muted text-center py-4">No data to display</div>';
            return;
        }
        const maxVal = Math.max.apply(null, data.concat([20]));
        this.histogram(containerId, data, title, xLabel, {
            color: options.color || this.colors.primary,
            xbins: options.xbins || { start: 1, size: 1 },
            xRange: options.xRange || [0.5, maxVal + 0.5],
            logY: true,  // Use log scale for carrier counts
            ...options
        });
    },

    /**
     * Create a total carriers histogram (log scale, capped range)
     */
    totalCarriersHistogram: function(containerId, data, title, options = {}) {
        // Guard against empty data
        if (!data || data.length === 0) {
            document.getElementById(containerId).innerHTML = '<div class="text-muted text-center py-4">No data to display</div>';
            return;
        }
        this.histogram(containerId, data, title, 'Number of carriers per variant', {
            color: options.color || this.colors.secondary,
            xbins: { start: 1, end: 300, size: 2 },
            xRange: [0, 300],
            logY: true,
            ...options
        });
    },

    /**
     * Utility: darken a hex color
     */
    darken: function(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },

    /**
     * Remove loading spinner for a chart container
     */
    hideLoader: function(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const card = container.closest('.chart-card');
            if (card) {
                const loader = card.querySelector('.chart-loader');
                if (loader) loader.style.display = 'none';
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VBCharts;
}

/**
 * Shared Plotly Chart Theme for Variant Browser
 *
 * Provides consistent styling across all gene pages.
 * Usage: VBCharts.binned(data, title, xLabel, options)
 */

const VBCharts = {
    // Color palette matching the app's design
    colors: {
        primary: '#3b82f6',      // Blue
        secondary: '#06b6d4',    // Cyan
        accent: '#8b5cf6',       // Purple
        warning: '#f59e0b',      // Amber
        danger: '#ef4444',       // Red
        success: '#10b981',      // Green
        gradient: [              // For multiple series
            '#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'
        ]
    },

    // Base layout config
    baseLayout: {
        paper_bgcolor: 'transparent',
        plot_bgcolor: '#fafafa',
        font: {
            family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            size: 12,
            color: '#374151'
        },
        margin: { t: 50, r: 30, b: 60, l: 65 },
        hoverlabel: {
            bgcolor: '#1f2937',
            bordercolor: '#1f2937',
            font: { color: 'white', size: 13 }
        },
        xaxis: {
            gridcolor: '#e5e7eb',
            linecolor: '#d1d5db',
            tickfont: { size: 11 },
            title: { standoff: 15 }
        },
        yaxis: {
            gridcolor: '#e5e7eb',
            linecolor: '#d1d5db',
            tickfont: { size: 11 },
            title: { standoff: 10 }
        }
    },

    // Plotly config (toolbar, interactions)
    config: {
        responsive: true,
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
        displaylogo: false
    },

    /**
     * Create a styled histogram trace
     */
    histogramTrace: function(data, options = {}) {
        const color = options.color || this.colors.primary;
        return {
            x: data,
            type: 'histogram',
            marker: {
                color: color,
                line: {
                    color: this.darken(color, 20),
                    width: 1
                },
                opacity: 0.85
            },
            hovertemplate: '<b>%{y}</b> variants<br>%{x} carriers<extra></extra>',
            ...options.trace
        };
    },

    /**
     * Create a histogram with consistent styling
     * @param {string} containerId - DOM element ID
     * @param {Array} data - Data array for histogram
     * @param {string} title - Chart title
     * @param {string} xLabel - X-axis label
     * @param {Object} options - Additional options
     */
    histogram: function(containerId, data, title, xLabel, options = {}) {
        const trace = this.histogramTrace(data, options);

        if (options.xbins) {
            trace.xbins = options.xbins;
            trace.autobinx = false;
        }

        const layout = {
            ...this.baseLayout,
            title: {
                text: title,
                font: { size: 14, color: '#1f2937', weight: 600 },
                x: 0.02,
                xanchor: 'left'
            },
            xaxis: {
                ...this.baseLayout.xaxis,
                title: { text: xLabel, standoff: 15 },
                range: options.xRange || null
            },
            yaxis: {
                ...this.baseLayout.yaxis,
                title: { text: options.yLabel || 'Number of variants', standoff: 10 },
                type: options.logY ? 'log' : 'linear',
                // Semi-log: log scale with linear-looking tick labels
                tickmode: options.logY ? 'array' : 'auto',
                tickvals: options.logY ? [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000] : null,
                ticktext: options.logY ? ['1', '2', '5', '10', '20', '50', '100', '200', '500', '1k', '2k', '5k', '10k'] : null,
                autorange: true
            },
            bargap: 0.05
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

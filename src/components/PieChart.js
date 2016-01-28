'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    d3 = require('d3'),
    numeral = require('numeral'),
    ChartLegend = require('./ChartLegend'),
    Loading = require('./Loading'),
    Tooltip = require('./Tooltip'),
    styler = require('react-styler'),
    mixinChart = require('../mixins/mixinChart');

var PieChart = React.createClass({

    displayName: 'PieChart',

    propTypes: {
        chartOuterRadius: React.PropTypes.number,
        chartInnerRadius: React.PropTypes.number,
        metric: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
        renderLegendItem: React.PropTypes.func,
        totalCaption: React.PropTypes.string,
        totalFormat: React.PropTypes.string,
        legendVisible: React.PropTypes.bool,
        hideChartOnLoading: React.PropTypes.bool,
        spinnerInternal: React.PropTypes.bool,
        spinnerColor: React.PropTypes.string,
        renderTooltip: React.PropTypes.func,
        styleTooltip: React.PropTypes.func,
        tooltipPosition: React.PropTypes.string,
        tooltipAlign: React.PropTypes.string,
        tooltipArrowSize: React.PropTypes.number,
        tooltipArrowAngle: React.PropTypes.number
    },

    mixins: [styler.mixinFor('PieChart'), mixinChart],

    /**
     * init
     */

    getDefaultProps() {
        return {
            chartOuterRadius: 372,
            chartInnerRadius: 186,
            legendVisible: true,
            spinnerInternal: true,
            spinnerColor: 'rgba(0,0,0,0.3)',
            metric: 'views',
            totalFormat: '0,0',
            tooltipPosition: 'top center',
            data: []
        };
    },

    /**
     * helpers
     */

    initChart() {

        var that = this,
            chartDOMNode = ReactDOM.findDOMNode(this.refs['chart']);

        // init chart canvas
        this.svg = d3.select(chartDOMNode).append('svg')
            .attr('width', this.props.chartOuterRadius)
            .attr('height', this.props.chartOuterRadius)
            .append('g')
            .attr('transform', 'translate(' + this.props.chartOuterRadius / 2 + ',' +
                this.props.chartOuterRadius / 2 + ')');

        // define chart layout for data (like scale)
        this.layoutPie = d3.layout.pie()
            .value((d, i) => d.value)
            .sort(null);

        // define chart function
        this.arc = d3.svg.arc()
            .outerRadius(this.props.chartOuterRadius / 2)
            .innerRadius(this.props.chartInnerRadius / 2);

        // define function for transitions
        this.arcTween = function (a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return t => that.arc(i(t));
        };

    },

    updateChart(data, props) {
        props = props || this.props;
        if (_.isEmpty(data) && !props.error) {
            return;
        }

        var that = this,
            color = this.getColorFunc();

        // clone the data
        data = JSON.parse(JSON.stringify(data));
        if (props.error) {
            data = [{name: '', value: 1}];
            color = d3.scale.ordinal().range(['#f5f5f5']);
        }

        // fill empty values
        if (data.length <= props.limit) {
            _.each(_.range(data.length, props.limit + 1), (index) => {
                data[index] = {
                    name: '',
                    value: 0
                };
            });
        }

        _.each(data, (item, index) => {
            if (!_.isNumber(item.value)) {
                item.value = 0;
            }
            item.value = ((this.state.chartLegendOpened && index === this.props.limit) ||
            this.state.disabledItems.indexOf(index) === -1) ?
                Math.max(item.value, 0) : 0;
        });

        if (data.length && _.every(data, item => !item.value)) {
            data[0].value = 1;
        }

        if (!this.svg) {
            return;
        }

        if (!this.chart) {

            var _tooltipTimer;

            // first initial render
            this.chart = this.svg
                .selectAll('path')
                .data(this.layoutPie(this.limit(data)))
                .enter().append('path')
                .on('mouseover', function (d, i, j) {
                    that.setState({
                        selectedLegendItem: i
                    });
                    var renderTooltip = that.props.renderTooltip || that.renderTooltip;
                    if (renderTooltip && !d['__noTooltip']) {
                        clearTimeout(_tooltipTimer);
                        var style = that.props.styleTooltip ? that.props.styleTooltip : (d, i, j) => ({
                            borderColor: that.getColorFunc()(j)
                        });
                        _tooltipTimer = setTimeout(() => {
                            that.refs['tooltip'].show.call(null, {
                                content: renderTooltip(d, i, j, that.getColorFunc()),
                                style: _.isFunction(style) ? style(d, i, j, that.getColorFunc()) : style
                            }, {target: this});
                        }, 250);
                    }
                })
                .on('mouseout', () => {
                    clearTimeout(_tooltipTimer);
                    _tooltipTimer = setTimeout(() => {
                        this.refs['tooltip'].hide();
                    }, 100);
                })
                .attr('d', this.arc)
                .style('fill', (d, i) => color(i))
                .each(function (d) {
                    this._current = d;
                });

        } else {

            // re-render
            // applying the data
            this.chart = this.chart.data(this.layoutPie(this.limit(data)));

            // transition
            this.chart
                .transition()
                .duration(500)
                .attrTween('d', this.arcTween)
                .style('fill', (d, i) => color(i));

        }
    },

    handleChartLegendOpen() {
        this.setState({chartLegendOpened: true}, () => {
            this.updateChart(this.props.data, this.props);
        });
    },

    handleChartLegendClose() {
        this.setState({chartLegendOpened: false}, () => {
            this.updateChart(this.props.data, this.props);
        });
    },

    /**
     * lifecycle
     */

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.error, this.props.error)) {
            this.updateChart(nextProps.data, nextProps);
        }
    },

    /**
     * render
     */

    renderLegendItem(item, index, legendState) {

        var cn = this.className;
        var active = !legendState.opened || index < this.props.limit;
        var style = {
            minWidth: this.props.legendWidth ?
                this.props.legendWidth :
            this.props.width - this.props.chartOuterRadius - 55,
            opacity: ((this.state.chartLegendOpened && index === this.props.limit) ||
            this.state.disabledItems.indexOf(index) === -1) ? 1 : 0.5
        };
        if (active) {
            style.cursor = 'pointer';
        }

        var styleColor = {
            backgroundColor: active ? this.getColorFunc()(index) : ''
        };

        var metric;
        if (_.isArray(this.props.metric)) {
            if (Math.abs(parseInt(item.value)) === 1) {
                metric = this.props.metric[0];
            } else {
                metric = this.props.metric[1];
            }
        } else {
            metric = this.props.metric;
        }

        var onClick = this.handleToggleLegendItem.bind(this, item, index, legendState, this.props.data.length);

        var classes = ['legend-item'];
        if (active && this.state.selectedLegendItem === index) {
            classes.push('legend-item-selected');
        }

        /* jshint ignore:start */
        return <div
            key={index} className={cn(classes)} style={style}
            onClick={active && onClick}
            onMouseOver={this.handleMouseOverLegendItem.bind(this, item, index, legendState)}
            onMouseOut={this.handleMouseOutLegendItem.bind(this, item, index, legendState)}
        >
            <span className={cn('legend-item-color')} style={styleColor}/>
            <span className={cn('legend-item-name')}>{item.name}</span>
            <span className={cn('legend-item-value')}>{numeral(item.value).format('0,0') + ' ' + metric}</span>
            {this.props.groupExtra &&
            <span className={cn('legend-item-percentage')}>{numeral(item.percentage).format('0%')}</span>}
        </div>;
        /* jshint ignore:end */
    },

    render() {

        var cn = this.className;
        var style = {},
            styleChart = {},
            styleLegend = {};
        this.applyStyles(style, styleChart, styleLegend);

        var spinnerColor = this.props.spinnerColor || this.getColorFunc()(0);

        /* jshint ignore:start */
        return <div style={style} className={cn()}>
            <div style={styleChart}>
                {this.props.loading && (this.props.spinnerInternal ?
                        <Loading
                            type='spin'
                            size={this.props.chartInnerRadius > 30 ?
                            this.props.chartInnerRadius * 0.6 : this.props.chartOuterRadius * 0.3}
                            left={this.props.chartOuterRadius / 2} top={this.props.chartOuterRadius / 2}
                            className={cn('spinner')} visible={true} style={{fill: spinnerColor}}/> :
                        <Loading
                            type='spin' size={this.props.chartOuterRadius} left={0} top={0}
                            className={cn('spinner')} visible={true} style={{fill: spinnerColor}}
                        />
                )}
                <div ref='chart' style={{opacity: this.props.hideChartOnLoading && this.props.loading ? '0' : '1'}}
                     className={cn('chart')}></div>
                {!this.props.error && !!this.props.total && this.props.totalCaption && <div className={cn('caption')}>
                    {this.props.totalCaption}
                    <span className={cn('caption-total')}>
                        {numeral(this.props.total).format(this.props.totalFormat)}
                    </span>
                </div>}
            </div>
            {this.props.error ?
                <div className={cn('error')} style={styleLegend}>{this.props.error}</div> :
                (this.props.legendVisible && <ChartLegend
                    style={styleLegend}
                    data={this.props.data}
                    limit={this.props.limit}
                    onOpen={this.handleChartLegendOpen}
                    onClose={this.handleChartLegendClose}
                    groupExtra={this.props.groupExtra}
                    renderItem={this.props.renderLegendItem || this.renderLegendItem}
                />)}
            <Tooltip
                className={cn('tooltip')} ref='tooltip'
                position={this.props.tooltipPosition} align={this.props.tooltipAlign}
                arrowSize={this.props.tooltipArrowSize} arrowAngle={this.props.tooltipArrowAngle}
            />
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = PieChart;

/**
 * jss
 */

styler.registerComponentStyles('PieChart', {
    color: '#464646',
    display: 'flex',
    alignContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    userSelect: 'none',

    '&-spinner svg': {
        fill: 'inherit'
    },

    '&-chart': {
        transition: 'opacity 200ms'
    },

    '&-caption': {
        fontSize: 22,
        marginTop: 20,
        textAlign: 'center'
    },

    '&-caption-total': {
        fontFamily: 'GothamMedium, "Helvetica Neue", Helvetica, Arial, sans-serif'
    },

    '& .ScrollableContent-scroller': {
        width: 'auto'
    },

    '&-legend-item': {
        marginTop: 5,
        marginBottom: 15,
        lineHeight: '25px',
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        cursor: 'default'
    },

    '&-legend-item-color': {
        flexShrink: '0',
        width: 25,
        height: 25
    },

    '&-legend-item-name': {
        paddingLeft: 15,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flexGrow: '1'
    },

    '&-legend-item-selected &-legend-item-name': {
        backgroundColor: '#c3d0f3',
        color: '#4972f0'
    },

    '&-legend-item-value': {
        flexShrink: '0',
        textAlign: 'right',
        marginLeft: 40,
        marginRight: 1
    },

    '&-legend-item-percentage': {
        flexShrink: '0',
        textAlign: 'right',
        width: 70,
        marginLeft: 40,
        marginRight: 1
    },
    '&-legend-item-percentage:before': {
        content: '"("'
    },
    '&-legend-item-percentage:after': {
        content: '")"'
    },

    '&-tooltip': {
        marginLeft: 1.5,
        borderWidth: 2,
        transition: 'left 200ms, top 200ms'
    },

    '&-error': {
        fontStyle: 'italic',
        color: '#9a9a9a'
    }
});

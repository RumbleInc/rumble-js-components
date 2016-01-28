'use strict';

var React = require('react'),
    _ = require('lodash'),
    d3 = require('d3');

var mixinChart = {

    propTypes: {
        limit: React.PropTypes.number,
        loading: React.PropTypes.bool,
        data: React.PropTypes.array,
        colors: React.PropTypes.array,
        groupExtra: React.PropTypes.bool,
        legendWidth: React.PropTypes.number,
        legendHeight: React.PropTypes.number,
        legendPosition: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
        chartWidth: React.PropTypes.number,
        chartHeight: React.PropTypes.number,
        chartPadding: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.shape({
            top: React.PropTypes.number,
            right: React.PropTypes.number,
            bottom: React.PropTypes.number,
            left: React.PropTypes.number
        })]),
        width: React.PropTypes.number,
        onLegendItemMouseOver: React.PropTypes.func,
        onLegendItemMouseOut: React.PropTypes.func
    },

    getDefaultProps: () => ({
        limit: 5,
        chartWidth: 400,
        chartHeight: 400,
        chartPadding: {top: 0, right: 0, bottom: 0, left: 0}
    }),

    getInitialState: () => ({
        disabledItems: []
    }),

    /**
     * helpers
     */

    isLegend(where, props) {
        props = props || this.props;
        var positions = (_.isString(props['legendPosition']) ?
                props['legendPosition'].toLowerCase().split(' ') :
                props['legendPosition']) || [];
        return positions.indexOf(where) !== -1;
    },

    getChartPadding(side, props) {
        props = props || this.props;
        if (_.isPlainObject(props.chartPadding)) {
            return props.chartPadding[side];
        } else {
            return props.chartPadding;
        }
    },

    limit(data, limit) {
        limit = limit || this.props.limit;
        return _.reduce(data, (result, item, index) => {
            if (index < limit) {
                result[index] = item;
            } else if (this.props.groupExtra) {
                if (result[limit]) {
                    result[limit].value += item['value'];
                } else {
                    result[limit] = {
                        name: 'Other',
                        value: item['value']
                    };
                }
            }
            return result;
        }, []);
    },

    getColorFunc() {
        if (!this.color) {
            this.color = this.props.colors ?
                d3.scale.ordinal().range(this.props.colors) :
                d3.scale.category20();
        }
        return this.color;
    },

    applyStyles(style, styleChart, styleLegend) {

        style.width = this.props.width;

        if (this.isLegend('inside')) {

            style.position = 'relative';
            styleLegend.position = 'absolute';
            if (this.isLegend('top')) {
                styleLegend.top = this.getChartPadding('top');
            } else if (this.isLegend('bottom')) {
                styleLegend.bottom = this.getChartPadding('bottom');
            } else {
                styleLegend.top = (this.props.chartHeight - this.getChartPadding('top') -
                    this.getChartPadding('bottom') - this.props.legendHeight) / 2 + this.getChartPadding('top');
            }

            if (this.isLegend('left')) {
                styleLegend.left = this.getChartPadding('left');
            } else if (this.isLegend('right')) {
                styleLegend.right = this.getChartPadding('right');
            } else {
                styleLegend.left = (this.props.chartWidth - this.getChartPadding('left') -
                    this.getChartPadding('right') - this.props.legendWidth) / 2 + this.getChartPadding('left');
            }
            styleLegend.width = this.props.legendWidth;
            styleLegend.height = this.props.legendHeight;

        } else { // outside

            var alignSelf;
            if (this.isLegend('below') || this.isLegend('under')) {

                style.flexDirection = 'column';
                style.WebkitFlexDirection = 'column';
                styleChart.flexGrow = '1';
                styleChart.WebkitFlexGrow = '1';
                alignSelf = this.isLegend('left') ? 'flex-start' :
                    (this.isLegend('right') ? 'flex-end' : undefined);
                styleLegend.alignSelf = alignSelf;
                styleLegend.WebkitAlignSelf = alignSelf;
                styleLegend.width = this.props.legendWidth;
                styleLegend.height = this.props.legendHeight;
                if (this.isLegend('left')) {
                    styleLegend.marginLeft = this.getChartPadding('left');
                } else if (this.isLegend('right')) {
                    styleLegend.marginRight = this.getChartPadding('right');
                }

            } else if (this.isLegend('above') || this.isLegend('over')) {

                style.flexDirection = 'column';
                style.WebkitFlexDirection = 'column';
                styleLegend.flexGrow = '1';
                styleLegend.WebkitFlexGrow = '1';
                styleLegend.order = '-1';
                styleLegend.WebkitOrder = '-1';
                alignSelf = this.isLegend('left') ? 'flex-start' :
                    (this.isLegend('right') ? 'flex-end' : undefined);
                styleLegend.alignSelf = alignSelf;
                styleLegend.WebkitAlignSelf = alignSelf;
                styleLegend.width = this.props.legendWidth;
                styleLegend.height = this.props.legendHeight;
                if (this.isLegend('left')) {
                    styleLegend.marginLeft = this.getChartPadding('left');
                } else if (this.isLegend('right')) {
                    styleLegend.marginRight = this.getChartPadding('right');
                }

            } else if (this.isLegend('left')) {

                style.flexDirection = 'row';
                style.WebkitFlexDirection = 'row';
                styleLegend.flexGrow = '1';
                styleLegend.WebkitFlexGrow = '1';
                styleLegend.order = '-1';
                styleLegend.WebkitOrder = '-1';
                alignSelf = this.isLegend('top') ? 'flex-start' :
                    (this.isLegend('bottom') ? 'flex-end' : undefined);
                styleLegend.alignSelf = alignSelf;
                styleLegend.WebkitAlignSelf = alignSelf;
                styleLegend.width = this.props.legendWidth || (this.props.width - this.props.chartWidth) -
                    this.getChartPadding('left');
                styleLegend.height = this.props.legendHeight;

            } else { // right

                style.flexDirection = 'row';
                style.WebkitFlexDirection = 'row';
                styleChart.flexGrow = '1';
                styleChart.WebkitFlexGrow = '1';
                alignSelf = this.isLegend('top') ? 'flex-start' :
                    (this.isLegend('bottom') ? 'flex-end' : undefined);
                styleLegend.alignSelf = alignSelf;
                styleLegend.WebkitAlignSelf = alignSelf;
                styleLegend.width = this.props.legendWidth || (this.props.width - this.props.chartWidth) -
                    this.getChartPadding('right');
                styleLegend.height = this.props.legendHeight;

            }

        }

    },

    /**
     * handlers
     */

    handleToggleLegendItem(item, index, legendState, count) {

        if (index < this.props.limit || (this.props.groupExtra && index === this.props.limit && !legendState.opened)) {
            var disabledItems = JSON.parse(JSON.stringify(this.state.disabledItems)) || [];
            if (disabledItems.indexOf(index) === -1) {
                disabledItems.push(index);
            } else {
                disabledItems = _.difference(disabledItems, [index]);
            }
            count = count || this.props.limit;
            if (_.difference(_.range(0, Math.min(count, this.props.limit)), disabledItems).length > 0) {
                this.setState({disabledItems: disabledItems}, () => {
                    this.updateChart(this.props.data, this.props);
                });
            }
        }

    },

    handleMouseOverLegendItem(item, index, legendState, event) {
        this.setState({
            selectedLegendItem: index
        });
        this.props.onLegendItemMouseOver && this.props.onLegendItemMouseOver(item, index, legendState, event);
    },

    handleMouseOutLegendItem(item, index, legendState, event) {
        this.setState({
            selectedLegendItem: null
        });
        this.props.onLegendItemMouseOut && this.props.onLegendItemMouseOut(item, index, legendState, event);
    },

    /**
     * lifecycle
     */

    componentDidMount() {
        this.initChart();
        this.updateChart(this.props.data, this.props);
    },

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.data, this.props.data)) {
            this.setState({
                disabledItems: []
            }, () => {
                this.updateChart(nextProps.data, nextProps);
            });
        }
    }

};

module.exports = mixinChart;

'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    d3 = require('d3'),
    moment = require('moment'),
    numeral = require('numeral'),
    ChartLegend = require('./ChartLegend'),
    Loading = require('./Loading'),
    Tooltip = require('./Tooltip'),
    ExportButton = require('./ExportButton'),
    styler = require('react-styler'),
    mixinChart = require('../mixins/mixinChart');

var DAYTIME_PATHS = {
    twilight: 'M16,9v1H0V9h2.6C2.5,8.7,2.5,8.3,2.5,8c0-0.4,0.1-0.8,0.1-1.2L0.2,6l0.3-1l2.4,0.8c0.3-0.8,0.8-1.4,1.4-2' +
    '   l-1.5-2l0.8-0.6l1.5,2c0.7-0.4,1.5-0.7,2.3-0.8V0h1v2.5c0.8,0.1,1.6,0.3,2.3,0.8l1.5-2l0.8,0.6l-1.5,2' +
    '       c0.6,0.5,1.1,1.2,1.4,2' +
    '       l2.4-0.8l0.3,1l-2.4,0.8c0.1,0.4,0.1,0.8,0.1,1.2c0,0.3,0,0.7-0.1,1H16z M12.5,8' +
    '       c0-2.5-2-4.5-4.5-4.5S3.5,5.5,3.5,8' +
    '       c0,0.3,0,0.7,0.1,1h8.8C12.5,8.7,12.5,8.3,12.5,8z',
    daytime: 'M13.4,9.2l2.4,0.8l-0.3,1l-2.4-0.8c-0.3,0.8-0.8,1.4-1.4,2l1.5,2l-0.8,0.6l-1.5-2c-0.7,0.4-1.5,0.7-2.3,0.8' +
    '       V16h-1v-2.5c-0.8-0.1-1.6-0.3-2.3-0.8l-1.5,2l-0.8-0.6l1.5-2c-0.6-0.5-1.1-1.2-1.4-2l-2.4,0.8l-0.3-1l2.4-0.8' +
    '       C2.6,8.8,2.5,8.4,2.5,8s0.1-0.8,0.1-1.2L0.2,6l0.3-1l2.4,0.8c0.3-0.8,0.8-1.4,1.4-2l-1.5-2l0.8-0.6l1.5,2' +
    '       c0.7-0.4,1.5-0.7,2.3-0.8' +
    '       V0h1v2.5c0.8,0.1,1.6,0.3,2.3,0.8l1.5-2l0.8,0.6l-1.5,2c0.6,0.5,1.1,1.2,1.4,2l2.4-0.8l0.3,1l-2.4,0.8' +
    '       c0.1,0.4,0.1,0.8,0.1,1.2' +
    '       S13.4,8.8,13.4,9.2z M8,3.5c-2.5,0-4.5,2-4.5,4.5s2,4.5,4.5,4.5s4.5-2,4.5-4.5S10.5,3.5,8,3.5',
    nighttime: 'M5.5,4.3c0.1,3.4,2.9,6.1,6.2,6.2c-0.8,1.2-2.2,2-3.7,2c-2.5,0-4.5-2-4.5-4.5C3.5,6.5,4.3,5.1,5.5,4.3' +
    '   M6.7,2.7C4.3,3.3,2.5,5.4,2.5,8c0,3,2.5,5.5,5.5,5.5c2.6,0,4.7-1.8,5.3-4.2' +
    '       c-0.4,0.1-0.9,0.2-1.3,0.2C9,9.5,6.5,7,6.5,4' +
    '       C6.5,3.5,6.6,3.1,6.7,2.7L6.7,2.7z'
};

var LineChart = React.createClass({

    displayName: 'LineChart',

    propTypes: {
        xAxisType: React.PropTypes.string,
        yAxisType: React.PropTypes.string,
        xAxisCaption: React.PropTypes.string,
        yAxisCaption: React.PropTypes.string,
        xDomain: React.PropTypes.arrayOf(React.PropTypes.number),
        yDomain: React.PropTypes.arrayOf(React.PropTypes.number),
        xAxisTickCaptionOffsetX: React.PropTypes.number,
        xAxisTickSize: React.PropTypes.number,
        xAxisTickPadding: React.PropTypes.number,
        interpolate: React.PropTypes.string,
        xTicks: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.func]),
        yAxisTickFormat: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        data: React.PropTypes.shape({
            data: React.PropTypes.arrayOf(React.PropTypes.array),
            names: React.PropTypes.arrayOf(React.PropTypes.string)
        }),
        renderLegendItem: React.PropTypes.func,
        renderTooltip: React.PropTypes.func,
        styleTooltip: React.PropTypes.func,
        tooltipPosition: React.PropTypes.string,
        tooltipAlign: React.PropTypes.string,
        tooltipArrowSize: React.PropTypes.number,
        tooltipArrowAngle: React.PropTypes.number,
        exportEnabled: React.PropTypes.bool,
        exportFilename: React.PropTypes.string,
        xAxisTimeFormat: React.PropTypes.string,
        xAxisTickRotate: React.PropTypes.number
    },

    mixins: [styler.mixinFor('LineChart'), mixinChart],

    /**
     * init
     */

    getDefaultProps() {
        return {
            xTicks: 10,
            xAxisTickSize: 6,
            xAxisTickPadding: 9,
            interpolate: 'monotone',
            data: {},
            tooltipPosition: 'middle center',
            xAxisTimeFormat: 'MMM D'
        };
    },

    /**
     * helpers
     */

    initChart() {

        var cn = this.className,
            chartDOMNode = ReactDOM.findDOMNode(this.refs['chart']);

        // init canvas
        this.svg = d3.select(chartDOMNode).append('svg')
            .attr('width', this.props.chartWidth)
            .attr('height', this.props.chartHeight)
            .append('g')
            .attr('transform', 'translate(' + this.getChartPadding('left') + ',' + this.getChartPadding('top') + ')');

        var width = this.props.chartWidth - this.getChartPadding('left') - this.getChartPadding('right'),
            height = this.props.chartHeight - this.getChartPadding('top') - this.getChartPadding('bottom');

        this.svg.append('path')
            .attr('class', cn('background'))
            .attr('d', 'M0,0 v' + height + ' h' + width + ' v-' + height + ' Z');

        // init scales
        if (this.props.xAxisType === 'hour_of_day') {
            this.x = d3.time.scale()
                .range([0, width]);
            this.x.domain([moment('00:00', 'HH:mm').valueOf(), moment('24:00', 'HH:mm').valueOf()]);
        } else if (this.props.xAxisType === 'time') {
            this.x = d3.time.scale()
                .range([0, width]);
            if (this.props.xDomain) {
                this.x.domain(this.props.xDomain);
            }
        } else {
            this.x = d3.scale.linear()
                .range([0, width]);
            if (this.props.xDomain) {
                this.x.domain(this.props.xDomain);
            }
        }

        this.y = d3.scale.linear()
            .range([height, 0]);

        // init axises
        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .orient('bottom')
            .tickSize(this.props.xAxisTickSize, 0)
            .tickPadding(this.props.xAxisTickPadding)
            .tickFormat((d, i) => {
                if (this.props.xAxisType === 'hour_of_day') {
                    var hour = moment(d);
                    if (hour.format('H') === '12' || hour.format('H') === '0') {
                        return hour.format('ha');
                    } else {
                        return hour.format('h');
                    }
                } else if (this.props.xAxisType === 'time') {
                    return moment(d).format(this.props.xAxisTimeFormat);
                } else {
                    return d.name;
                }
            });

        if (this.props.xAxisType === 'hour_of_day') {
            this.xAxis = this.xAxis.ticks(d3.time.hour, 1);
        } else {
            this.xAxis = this.xAxis.ticks(this.props.xTicks);
        }

        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .orient('left')
            .ticks(4)
            .tickSize(6, 0)
            .tickPadding(6)
            .tickFormat((d) => {
                if (_.isFunction(this.props.yAxisTickFormat)) {
                    return this.props.yAxisTickFormat(d);
                } else {
                    if (d === Math.round(d)) {
                        if (d > 1000000 && d % 1000000 !== 0) {
                            return numeral(d).format(this.props.yAxisTickFormat || '0.0a').toUpperCase();
                        } else {
                            return numeral(d).format(this.props.yAxisTickFormat || '0a').toUpperCase();
                        }
                    }
                }
            });

        this.area = d3.svg.area()
            .interpolate(this.props.interpolate)
            .x(d => this.x(d.name))
            .y0(height)
            .y1(d => this.y(parseFloat(d.value)));

        // define chart function
        this.line = d3.svg.line()
            .interpolate(this.props.interpolate)
            .x(d => this.x(d.name))
            .y(d => this.y(parseFloat(d.value)));

        // render x axis
        var xAxisG = this.svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', cn('axis', 'axis-x'));

        if (this.props.xAxisType === 'hour_of_day') {
            // render grey rectangles for different daytime
            xAxisG.append('path')
                .attr('d', 'M0,0 v-' + height + ' h' + this.x(moment('05:30', 'HH:mm').valueOf()) +
                    ' v' + height + ' Z')
                .attr('fill', '#dbdbdb');
            xAxisG.append('path')
                .attr('d', 'M' + this.x(moment('05:30', 'HH:mm').valueOf()) + ',0 v-' + height + ' h' +
                    this.x(moment('01:00', 'HH:mm').valueOf()) + ' v' + height + ' Z')
                .attr('fill', '#e8e8e8');
            xAxisG.append('path')
                .attr('d', 'M' + this.x(moment('06:30', 'HH:mm').valueOf()) + ',0 v-' + height + ' h' +
                    this.x(moment('11:00', 'HH:mm').valueOf()) + ' v' + height + ' Z')
                .attr('fill', '#f5f5f5');
            xAxisG.append('path')
                .attr('d', 'M' + this.x(moment('17:30', 'HH:mm').valueOf()) + ',0 v-' + height + ' h' +
                    this.x(moment('01:00', 'HH:mm').valueOf()) + ' v' + height + ' Z')
                .attr('fill', '#e8e8e8');
            xAxisG.append('path')
                .attr('d', 'M' + this.x(moment('18:30', 'HH:mm').valueOf()) + ',0 v-' + height + ' h' +
                    this.x(moment('05:30', 'HH:mm').valueOf()) + ' v' + height + ' Z')
                .attr('fill', '#dbdbdb');

        }

        if (this.props.xAxisCaption) {
            xAxisG.append('text')
                .attr('class', cn('axis-x-caption'))
                .attr('y', 0)
                .attr('x', this.props.chartWidth - this.getChartPadding('left') - this.getChartPadding('right') + 21)
                .style('text-anchor', 'end')
                .style('alignment-baseline', 'middle')
                .text(this.props.xAxisCaption);
        }

        xAxisG.call(this.xAxis);
        var x0, x1;

        if (this.props.xAxisType === 'hour_of_day') {

            x0 = this.x(moment('00:00', 'H:mm').valueOf());
            x1 = this.x(moment('01:00', 'H:mm').valueOf());

            // render daytime icons
            xAxisG.selectAll('.tick')
                .append('path')
                .attr('transform', 'translate(-8,40)')
                .attr('d', (d) => {
                    var path;
                    var h = moment(d).format('H');
                    if ((h >= 0 && h <= 5) || (h >= 19)) {
                        path = DAYTIME_PATHS.nighttime;
                    } else if (h === '6' || h === '18') {
                        path = DAYTIME_PATHS.twilight;
                    } else {
                        path = DAYTIME_PATHS.daytime;
                    }
                    return path;
                });
        }

        if (!_.isUndefined(x0) && !_.isUndefined(x1)) {
            var pointsClassName = cn('points');
            var pointClassName = cn('point');
            xAxisG.selectAll('.tick')
                .append('path')
                .on('mouseover', (d, i) => {
                    this.chart.selectAll('g.' + pointsClassName).each(function () {
                        d3.select(this).selectAll('circle.' + pointClassName).each(function (d, _i) {
                            var d3this = d3.select(this);
                            d3this.style('opacity', i === _i ? 1 : 0);
                        });
                    });
                })
                .attr('d', (d, i) => {
                    if (i === 0) {
                        return 'M' + x0 + ',0 v-' + height + ' h' + (x1 / 2) + ' v' + height + ' Z';
                    } else {
                        return 'M' + (-x1 / 2) + ',0 v-' + height + ' h' + x1 + ' v' + height + ' Z';
                    }
                })
                .attr('fill', 'transparent');
        }

        if (this.props.xAxisTickCaptionOffsetX) {
            xAxisG.selectAll('.tick')
                .select('text')
                .attr('x', this.props.xAxisTickCaptionOffsetX);
        }

        if (this.props.xAxisTickRotate) {

            xAxisG.selectAll('.tick')
                .select('text')
                .attr('transform', 'rotate(' + this.props.xAxisTickRotate + ')');
        }

        if (this.props.xAxisType === 'time') {
            var xLimitRect = this.svg.select('.' + cn('background')).node().getBoundingClientRect();

            xAxisG.selectAll('.tick')
                .each(function () {
                    var line = this.querySelector('line');
                    if (line) {
                        var lineRect = line.getBoundingClientRect();
                        if (lineRect.left < xLimitRect.left || lineRect.right > xLimitRect.right) {
                            line.style.visibility = 'hidden';
                        }
                    }
                    var text = this.querySelector('text');
                    if (text) {
                        var textRect = text.getBoundingClientRect();
                        if (textRect.left < xLimitRect.left || textRect.right > xLimitRect.right) {
                            text.style.visibility = 'hidden';
                        }
                    }
                });
        }

        // render y axis
        this.svg.append('g')
            .attr('class', cn('axis', 'axis-y'))
            .append('text')
            .attr('class', cn('axis-y-caption'))
            .attr('y', -22)
            .attr('x', -44)
            .style('text-anchor', 'start')
            .text(this.props.yAxisCaption);

        // prepare the pane for lines
        this.chart = this.svg.append('g')
            .attr('class', cn('lines'));

    },

    updateChart(data) {

        if (_.isEmpty(data)) {
            return;
        }

        var cn = this.className,
            color = this.getColorFunc();

        // clone the data
        data = JSON.parse(JSON.stringify(data.data));

        // set disabled lines to zero
        data = _.map(data, (data, index) => (
            _.map(data, (item) => {
                if (this.state.disabledItems.indexOf(index) !== -1) {
                    item.value = 0;
                }
                return item;
            })
        ));

        if (this.props.xAxisType === 'hour_of_day') {
            // for every line add last missed point
            data = _.map(data, (data) => {
                data.push({
                    name: moment('24:00', 'HH:mm').valueOf(),
                    value: (_.findWhere(data, {'name': moment('00:00', 'HH:mm').valueOf()}) || {}).value || 0
                });
                return data;
            });
        }

        // detect maximums for x and y
        var maxX = -Infinity,
            maxY = -Infinity;
        _.each(data, (data) => {
            maxX = Math.max(maxX, data.length - 1);
            maxY = Math.max(maxY, d3.max(data, d => d.value * 1.2));
        });

        // define domains for x and y
        if (this.props.xAxisType === 'hour_of_day') {

            this.x.domain([moment('00:00', 'HH:mm').valueOf(), moment('24:00', 'HH:mm').valueOf()]);

        } else if (this.props.xAxisType === 'time') {

            if (this.props.xDomain) {
                this.x.domain(this.props.xDomain);
            } else {
                var minTime = Infinity,
                    maxTime = -Infinity;
                _.map(data, (data) => {
                    var names = _.pluck(data, 'name');
                    minTime = Math.min(minTime, _.min(names));
                    maxTime = Math.max(maxTime, _.max(names));
                });
                this.x.domain([minTime, maxTime]);
            }

        } else {
            if (this.props.xDomain) {
                this.x.domain(this.props.xDomain);
            } else {
                this.x.domain([0, maxX]);
            }
        }

        if (this.props.yDomain) {
            this.y.domain(this.props.yDomain);
        } else {
            this.y.domain([0, maxY]);
        }

        if (this.props.xAxisType === 'hour_of_day') {
            this.xAxis = this.xAxis.ticks(d3.time.hour, 1);
        } else {
            this.xAxis = this.xAxis.ticks(this.props.xTicks);
        }

        // re-render axises
        this.svg.select('g.' + cn('axis-x'))
            .call(this.xAxis);

        this.svg.select('g.' + cn('axis-x')).select('.' + cn('axis-x-caption'))
            .text(this.props.xAxisCaption);

        this.svg.select('g.' + cn('axis-y'))
            .call(this.yAxis);

        this.svg.select('g.' + cn('axis-y')).select('.' + cn('axis-y-caption'))
            .text(this.props.yAxisCaption);

        if (this.props.xAxisTickCaptionOffsetX) {
            this.svg.select('g.' + cn('axis-x'))
                .selectAll('.tick')
                .select('text')
                .attr('x', this.props.xAxisTickCaptionOffsetX);
        }

        if (this.props.xAxisTickRotate) {
            this.svg.select('g.' + cn('axis-x'))
                .selectAll('.tick')
                .select('text')
                .style('text-anchor', 'start')
                .attr('transform', 'rotate(' + this.props.xAxisTickRotate + ')');
        }

        if (this.props.xAxisType === 'time') {
            var xLimitRect = this.svg.select('.' + cn('background')).node().getBoundingClientRect();

            this.svg.select('g.' + cn('axis-x'))
                .selectAll('.tick')
                .each(function () {
                    var line = this.querySelector('line');
                    if (line) {
                        var lineRect = line.getBoundingClientRect();
                        if (lineRect.left < xLimitRect.left || lineRect.right > xLimitRect.right) {
                            line.style.visibility = 'hidden';
                        }
                    }
                    var text = this.querySelector('text');
                    if (text) {
                        var textRect = text.getBoundingClientRect();
                        if (textRect.left < xLimitRect.left || textRect.right > xLimitRect.right) {
                            text.style.visibility = 'hidden';
                        }
                    }
                });
        }
        var values = _.values(data);

        // render or re-render the cart
        var line = this.chart
            .selectAll('path.' + cn('line'))
            .data(values);
        line.enter().append('path').attr('class', cn('line'));
        line
            .transition()
            .duration(500)
            .attr('d', this.line)
            .style('fill', 'none')
            .style('stroke-width', 3)
            .style('opacity', (d, i) => this.state.disabledItems.indexOf(i) === -1 ? 1 : 0)
            .style('stroke', (d, i) => color(i));
        line.exit().remove();

        var areas = this.chart
            .selectAll('g.' + cn('areas'))
            .data([{}]);

        areas.enter().append('g')
            .attr('class', cn('areas'));

        var area = areas
            .selectAll('path.' + cn('area'))
            .data(values);
        area.enter().append('path').attr('class', cn('area'));
        area
            .transition()
            .duration(500)
            .attr('d', this.area)
            .style('opacity', (d, i) => this.state.disabledItems.indexOf(i) === -1 ? 0.5 : 0)
            .style('visibility', 'hidden')
            .style('fill', (d, i) => color(i));
        area.exit().remove();
        areas.exit().remove();

        // applying the data
        var update = this.chart
            .selectAll('g.' + cn('points'))
            .data(values);

        update.enter().append('g')
            .attr('class', cn('points'));

        // render points
        var points = update.selectAll('circle.' + cn('point'))
            .data(d => d);
        points.enter()
            .append('circle')
            .attr('class', cn('point'));
        points
            .style('fill', (d, i, j) => color(j))
            .style('opacity', 0)
            .attr('stroke', 'transparent')
            .attr('stroke-width', 14)
            .attr('cx', d => this.x(d.name))
            .attr('cy', d => this.y(parseFloat(d.value)))
            .attr('r', (d, i, j) => !d['__noPoint'] && this.state.disabledItems.indexOf(j) === -1 ? 3.5 : 0);
        points.exit().remove();

        var pointsClassName = cn('points');
        var pointClassName = cn('point');

        var _tooltipTimer;

        points = update.selectAll('circle.' + cn('hover'))
            .data(d => d);
        points.enter()
            .append('circle')
            .attr('class', cn('hover'))
            .on('mouseout', () => {
                clearTimeout(_tooltipTimer);
                _tooltipTimer = setTimeout(() => {
                    this.refs['tooltip'].hide();
                }, 100);
            })
            .on('mouseover', (d, i, j) => {
                var point;
                this.chart.selectAll('g.' + pointsClassName).each(function (d, lineIndex) {
                    var circle;
                    d3.select(this).selectAll('circle.' + pointClassName).each(function (d, _i) {
                        var d3this = d3.select(this);
                        d3this.style('opacity', i === _i ? 1 : 0);
                        if (i === _i) {
                            circle = d3this;
                        }
                    });
                    if (circle && lineIndex === j) {
                        point = circle;
                    }
                });
                this.setState({
                    selectedLegendItem: j
                });
                var renderTooltip = this.props.renderTooltip || this.renderTooltip;
                if (point && renderTooltip && !d['__noTooltip']) {
                    clearTimeout(_tooltipTimer);
                    var style = this.props.styleTooltip ? this.props.styleTooltip : (d, i, j) => ({
                        borderColor: this.getColorFunc()(j)
                    });
                    _tooltipTimer = setTimeout(() => {
                        this.refs['tooltip'].show.call(null, {
                            content: renderTooltip(d, i, j, this.getColorFunc()),
                            style: _.isFunction(style) ? style(d, i, j, this.getColorFunc()) : style
                        }, {target: point.node()});
                    }, 250);
                }
            });
        points
            .style('fill', 'transparent')
            .attr('cx', d => this.x(d.name))
            .attr('cy', d => this.y(parseFloat(d.value)))
            .attr('r', (d, i, j) => !d['__noPoint'] && this.state.disabledItems.indexOf(j) === -1 ? 20 : 0);
        points.exit().remove();

        // remove unnecessary lines
        update.exit().remove();
    },

    prepareDataForExport(data) {
        if (_.isEmpty(data)) {
            return;
        }

        var headers = [''];
        if (data.names && data.names.length > 0) {
            headers = headers.concat(data.names);
        } else {
            headers.push(this.props.yAxisCaption);
        }

        var all = {};
        _.each(data.data, (series, index) => {
            _.each(series, (point) => {
                if (point.__noPoint) {
                    return;
                }
                var name = point.name;
                if (this.props.xAxisType === 'time') {
                    name = moment(point.name).format('YYYY/MM/DD HH:mm');
                } else if (this.props.xAxisType === 'hour_of_day') {
                    name = moment(point.name).format('ha');
                }
                all[point.name] = all[point.name] || [name];
                all[point.name][index + 1] = point.value;

            });

        });

        var keys = _.keys(all);
        keys.sort();
        return [headers].concat(_.map(keys, key => all[key]));
    },

    /**
     * handlers
     */

    handleMouseOutChart(event) {
        if (event.target.tagName.toLowerCase() === 'svg') {
            this.setState({selectedLegendItem: null});
        }
    },

    /**
     * lifecycle
     */

    componentDidUpdate() {
        var that = this,
            areaClassName = this.className('area');
        this.chart.selectAll('path.' + areaClassName).each(function (d, i) {
            that.state && d3.select(this).style(
                'visibility',
                i === that.state.selectedLegendItem ? 'visible' : 'hidden'
            );
        });
    },

    /**
     * render
     */

    renderLegendItem(item, index, legendState) {

        var cn = this.className;
        var style = {
            opacity: this.state.disabledItems.indexOf(index) === -1 ? 1 : 0.5
        };
        var styleColor = {
            backgroundColor: this.getColorFunc()(index)
        };

        var classes = ['legend-item'];
        if (this.state.selectedLegendItem === index) {
            classes.push('legend-item-selected');
        }

        /* jshint ignore:start */
        return <div
            key={index} className={cn(classes)} style={style}
            onClick={this.handleToggleLegendItem.bind(this, item, index, legendState, this.props.data.names.length)}
            onMouseOver={this.handleMouseOverLegendItem.bind(this, item, index, legendState)}
            onMouseOut={this.handleMouseOutLegendItem.bind(this, item, index, legendState)}>
            <span className={cn('legend-item-color')} style={styleColor}/>
            <span className={cn('legend-item-name')}>{item}</span>
        </div>;
        /* jshint ignore:end */

    },

    renderTooltip(d, i, j, color) {
        var cn = this.className;
        var data = this.props.data || {};

        var names = data.names || {};
        var value = numeral(d.value).format('0,0');

        var styleChannel = {
            color: color(j)
        };
        /* jshint ignore:start */
        return <div className={cn('tooltip')}>
            {names[j] && <div className={cn('tooltip-channel')} style={styleChannel}>{names[j]}</div>}
            <div className={cn('tooltip-value')}>{value}</div>
        </div>;
        /* jshint ignore:end */
    },

    render() {

        var cn = this.className;
        var style = {},
            styleChart = {},
            styleLegend = {};
        this.applyStyles(style, styleChart, styleLegend);

        var loadingLeft = (this.props.chartWidth - this.getChartPadding('left') - this.getChartPadding('right')) / 2 +
            this.getChartPadding('left') - 20;
        var loadingTop = (this.props.chartHeight - this.getChartPadding('top') - this.getChartPadding('bottom')) / 2 +
            this.getChartPadding('top') - 20;

        /* jshint ignore:start */
        return <div style={style} className={cn()}>
            <div style={styleChart}>
                {this.props.loading &&
                <Loading
                    type='spin' size={60} className={cn('spinner')} visible={true}
                    left={loadingLeft}
                    top={loadingTop}
                />}
                <div ref='chart' className={cn('chart')} onMouseOut={this.handleMouseOutChart}>
                    {!this.props.loading && this.props.exportEnabled &&
                    <ExportButton data={this.prepareDataForExport(this.props.data)} title='Export to Excel/CSV'
                                  filename={this.props.exportFilename}/>}
                </div>
            </div>
            <ChartLegend
                style={styleLegend}
                data={this.props.data.names || []}
                limit={this.props.limit}
                groupExtra={this.props.groupExtra}
                renderItem={this.props.renderLegendItem || this.renderLegendItem}
                collapsible={false}
            />
            <Tooltip ref='tooltip' position={this.props.tooltipPosition} align={this.props.tooltipAlign}
                     arrowSize={this.props.tooltipArrowSize} arrowAngle={this.props.tooltipArrowAngle}/>
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = LineChart;

styler.registerComponentStyles('LineChart', {
    color: '#464646',
    display: 'flex',
    alignContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    userSelect: 'none',

    '&-spinner': {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 60,
        padding: 20
    },

    '&-chart': {
        position: 'relative'
    },

    '&-background': {
        fill: 'transparent'
    },

    '& .ExportButton': {
        position: 'absolute',
        right: 0,
        marginTop: -5
    },

    '& .ExportButton .Button-icon-primary': {
        marginRight: 0
    },

    '&-axis': {
        fontSize: '12px'
    },
    '&-axis .domain': {
        stroke: '#dadcdb',
        strokeWidth: 0.5,
        fill: 'none'
    },
    '&-axis line': {
        stroke: '#dbdbdb',
        strokeWidth: 1
    },

    '&-axis-x-caption': {
        fontSize: 20
    },

    '&-axis-y-caption': {
        fontSize: 20
    },

    '& .ChartLegend': {
        fontSize: 15,
        color: '#464646',
        lineHeight: '20px'
    },

    '& .Tooltip': {
        transition: 'left 200ms, top 200ms'
    },

    '&-legend-item': {
        display: 'inline-block',
        cursor: 'pointer',
        marginBottom: 8
    },

    '&-legend-item-color': {
        display: 'inline-block',
        verticalAlign: 'middle',
        width: 20,
        height: 20
    },

    '&-legend-item-name': {
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: 17,
        paddingLeft: 9,
        paddingRight: 9
    },

    '&-legend-item-selected &-legend-item-name': {
        backgroundColor: '#c3d0f3',
        color: '#4972f0'
    },

    '&-tooltip': {
        padding: 5,
        textAlign: 'center'
    },

    '&-tooltip-channel': {
        fontSize: 12,
        maxWidth: 180
    },

    '&-tooltip-channel:before': {
        content: '"\\2588"',
        display: 'inline-block',
        width: 10,
        height: 10,
        overflow: 'hidden',
        verticalAlign: 'middle',
        marginRight: 5,
        fontSize: '1em',
        lineHeight: '10px'
    },

    '&-tooltip-value': {
        fontSize: 16,
        color: '#464646'
    }

});

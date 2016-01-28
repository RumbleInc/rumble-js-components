'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    styler = require('react-styler'),
    numeral = require('numeral'),
    _ = require('lodash'),
    d3 = require('d3'),
    mixinChart = require('../mixins/mixinChart'),
    Tooltip = require('./Tooltip'),
    Loading = require('./Loading'),
    PromiseLoader = require('./PromiseLoader'),
    Icon = require('./Icon');

var GeoChart = React.createClass({

    displayName: 'GeoChart',

    propTypes: {
        data: React.PropTypes.object,
        geoObject: React.PropTypes.object.isRequired,
        tooltipPosition: React.PropTypes.string,
        tooltipAlign: React.PropTypes.string,
        tooltipArrowSize: React.PropTypes.number,
        tooltipArrowAngle: React.PropTypes.number,
        minColor: React.PropTypes.string,
        maxColor: React.PropTypes.string,
        metric: React.PropTypes.string,
        minZoom: React.PropTypes.number,
        maxZoom: React.PropTypes.number,
        formatValue: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string])
    },

    mixins: [
        styler.mixinFor('GeoChart'),
        mixinChart
    ],

    /**
     * init
     */

    getDefaultProps: () => ({
        data: {},
        tooltipPosition: 'middle center',
        minColor: '#bccaf9',
        maxColor: '#285bea',
        minZoom: 0.8,
        maxZoom: 8
    }),

    /**
     * helpers
     */

    initChart() {
        this.zoom = d3.behavior.zoom()
            .scaleExtent([this.props.minZoom, this.props.maxZoom])
            .on('zoom', () => {
                d3.select(ReactDOM.findDOMNode(this.refs['mainGroup']))
                    .attr('transform', 'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')')
                    .attr('style', 'stroke-width:' + (1 / (d3.event.scale || 1)));
            });

        d3.select(ReactDOM.findDOMNode(this.refs['svg']))
            .call(this.zoom)
            .call(this.zoom.event);
    },

    updateChart(data) {
    },

    getColors() {
        return d3.interpolateRgb(this.props.minColor, this.props.maxColor);
    },

    getMax() {
        return _.max(_.values(this.props.data));
    },

    getMin() {
        return _.min(_.values(this.props.data));
    },

    formatValue(value) {
        if (value !== Infinity && value !== -Infinity) {
            return _.isFunction(this.props.formatValue) ?
                this.props.formatValue(value) :
                numeral(value).format(this.props.formatValue || '0,0');
        } else {
            return value;
        }
    },

    /**
     * handlers
     */

    handleMouseMove(feature, event) {
        this.refs['tooltip'].show({
            content: this.props.renderTooltip ? this.props.renderTooltip(feature) : this.renderTooltip(feature),
            atPointerPosition: true
        }, event);
    },

    handleMouseOut() {
        this.refs['tooltip'].hide();
    },

    handleScrollWindow() {
        clearTimeout(this._windowScrollingTime);
        let svg = ReactDOM.findDOMNode(this.refs['svg']);
        svg.style.pointerEvents = 'none';

        this._windowScrollingTime = setTimeout(() => {
            svg.style.pointerEvents = 'auto';
        }, 1000);
    },

    handleZoom(zoomIn, event) {
        event.preventDefault();

        var scale = this.zoom.scale(),
            extent = this.zoom.scaleExtent(),
            translate = this.zoom.translate(),
            x = translate[0], y = translate[1],
            factor = zoomIn ? 1.8 : 1 / 1.8,
            targetScale = scale * factor;

        // If we're already at an extent, done
        if (targetScale === extent[0] || targetScale === extent[1]) {
            return false;
        }
        // If the factor is too much, scale it down to reach the extent exactly
        var clampedTargetScale = Math.max(extent[0], Math.min(extent[1], targetScale));
        if (clampedTargetScale !== targetScale) {
            targetScale = clampedTargetScale;
            factor = targetScale / scale;
        }

        var center = [this.props.width / 2, this.props.height / 2];

        // Center each vector, stretch, then put back
        x = (x - center[0]) * factor + center[0];
        y = (y - center[1]) * factor + center[1];

        // Transition to the new view over 350ms
        d3.transition().duration(350).tween('zoom', () => {
            var interpolateScale = d3.interpolate(scale, targetScale),
                interpolateTrans = d3.interpolate(translate, [x, y]);
            return (t) => {
                this.zoom.scale(interpolateScale(t))
                    .translate(interpolateTrans(t));
                d3.select(ReactDOM.findDOMNode(this.refs['svg']))
                    .call(this.zoom.event);
            };
        });
    },

    /**
     * lifecycle
     */

    componentDidMount() {
        window.addEventListener('scroll', this.handleScrollWindow);
    },

    componentWillUnmount() {
        clearTimeout(this._windowScrollingTime);
        window.removeEventListener('scroll', this.handleScrollWindow);
    },

    /**
     * render
     */

    renderTooltip(feature) {
        var cn = this.className;
        var data = this.props.data || {};

        var name = feature.properties['name'];
        var propertyName = this.props.propertyName || 'iso_a2';
        var value = this.formatValue(data[feature.properties[propertyName]]);

        var styleName = {
            color: this.props.maxColor
        };

        /* jshint ignore:start */
        return <div className={cn('tooltip')}>
            <div className={cn('tooltip-name')} style={styleName}>{name}</div>
            <div className={cn('tooltip-value')}>{value}</div>
            {this.props.metric && <div className={cn('tooltip-caption')}>{this.props.metric}</div>}
        </div>;
        /* jshint ignore:end */
    },

    render() {
        var cn = this.className;

        var width = this.props.width,
            height = this.props.height;

        var geoObject = this.props.geoObject;

        var styleSvg = {
            width: width,
            height: height
        };
        var projection = d3.geo.mercator()
            .translate([width / 2, height * 0.6])
            .scale((width - 1) / 2 / Math.PI);
        //.precision(0.1);

        var path = d3.geo.path()
            .projection(projection);

        var colors = this.getColors();
        var max = this.getMax();
        var min = this.getMin();

        var transform = 'translate(' + (this.formatValue(min).length) * 14 + 'px,' + Math.max(0, height - 10) + 'px)';
        var styleLegendGradient = {
            transform: transform,
            WebkitTransform: transform,
            MozTransform: transform
        };

        /* jshint ignore:start */
        return <div className={cn()}>
            {this.props.loading && <Loading type='spin' size={60} className={cn('spinner')} visible={true}
                                            left={width / 2 - 30}
                                            top={height / 2 - 30}
            />}
            <div className={cn('zoom')} style={{width}}>
                <Icon icon='map_zoom_in' className={cn('zoom-in')} onClick={this.handleZoom.bind(this, true)}/>
                <Icon icon='map_zoom_out' className={cn('zoom-out')} onClick={this.handleZoom.bind(this, false)}/>
            </div>
            <svg ref='svg' style={styleSvg}>
                <defs>
                    <linearGradient id='legendGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                        <stop offset='0%' style={{stopColor: this.props.minColor, stopOpacity: 1}}/>
                        <stop offset='100%' style={{stopColor: this.props.maxColor, stopOpacity: 1}}/>
                    </linearGradient>
                </defs>
                <g ref='mainGroup'>
                    <g>
                        {_.map(geoObject.features, (feature, index) => {
                            var props = {}, active = false;
                            var propertyName = this.props.propertyName || 'iso_a2';
                            var value = this.props.data[feature.properties[propertyName]];
                            if (value) {
                                active = true;
                                props.onMouseMove = this.handleMouseMove.bind(this, feature);
                                props.onMouseOut = this.handleMouseOut;
                                props.style = {
                                    fill: colors((value - min) / (max === min ? 1 : max - min))
                                }
                            }
                            return <path
                                key={index}
                                className={cn('country', active ? 'country-active' : 'country-inactive')}
                                d={path(feature, index)} {...props}
                            />;
                        })}
                    </g>
                </g>
                {!_.isEmpty(this.props.data) && <g className={cn('legend-gradient')} style={styleLegendGradient}>
                    <text x={0} y={0} textAnchor='end'>{this.formatValue(min)}</text>
                    <rect x={7} y={-9} width={140} height={10} fill='url(#legendGradient)'/>
                    <text x={150} y={0}>{this.formatValue(max)}</text>
                </g>}
            </svg>
            <Tooltip ref='tooltip' position={this.props.tooltipPosition} align={this.props.tooltipAlign}
                     arrowSize={this.props.tooltipArrowSize} arrowAngle={this.props.tooltipArrowAngle}/>
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = GeoChart;

styler.registerComponentStyles('GeoChart', {

    '&-spinner': {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 60,
        padding: 20
    },

    '&-country': {
        fill: '#f8f7f5'
    },

    '&-country-inactive': {
        stroke: '#eae9e5'
    },

    '&-country-active': {
        stroke: '#eae9e5'
    },

    '&-country-active:hover': {
        fill: '#416bdb !important'
    },

    '& .Tooltip': {
        marginTop: -5,
        marginLeft: 1.5
    },

    '&-tooltip': {
        padding: 10,
        textAlign: 'center'
    },

    '&-tooltip-name': {
        fontSize: 12,
        maxWidth: 180
    },

    '&-tooltip-name:before': {
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
        fontSize: 48,
        color: '#464646'
    },

    '&-tooltip-caption': {
        fontSize: 18,
        color: '#464646'
    },

    '&-legend-gradient': {
        fontSize: 12
    },

    '&-zoom': {
        position: 'relative'
    },
    '&-zoom .Icon': {
        position: 'absolute',
        right: 20
    },
    '&-zoom-in': {
        top: 20
    },
    '&-zoom-out': {
        top: 50
    }

});

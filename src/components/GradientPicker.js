/**
 * GradientPicker
 *
 * @example
 * <GradientPicker />
 */

'use strict';
var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler'),
    ColorPicker = require('./ColorPicker');

var GradientPicker = React.createClass({

    displayName: 'GradientPicker',

    propTypes: {
        pickerType: React.PropTypes.string,
        colorFormat: React.PropTypes.string,

        /**
         * value (object) look at the LinearGradient model
         */
        value: React.PropTypes.any,

        /**
         * defaultValue
         */
        defaultValue: React.PropTypes.any,

        /**
         * callback function calls on changing value
         */
        onChange: React.PropTypes.func
    },

    mixins: [
        styler.mixinFor('GradientPicker')
    ],

    // init

    getInitialState() {
        let { props } = this;
        return {
            value: _.cloneDeep(_.isUndefined(props.value) ? props.defaultValue : props.value)
        };
    },

    getDefaultProps() {
        return {
            pickerFocusable: true
        };
    },

    // helpers

    updateValue(startColor, endColor) {
        var { value } = this.state;

        if (!_.isPlainObject(value)) {
            value = {};
        }
        value.type = 'linearGradient';
        if (_.isEmpty(value.colors)) {
            value.colors = [null, null];
        }

        if (!_.isUndefined(startColor)) {
            value.colors[0] = startColor;
        }
        if (!_.isUndefined(endColor)) {
            value.colors[1] = endColor;
        }
        this.setState({value});
        this.props.onChange && this.props.onChange({target: {value}});
    },

    handleStartColorColorChange(e) {
        this.updateValue(_.isUndefined(e.target) ? e : e.target.value);
    },

    handleEndColorColorChange(e) {
        this.updateValue(undefined, _.isUndefined(e.target) ? e : e.target.value);
    },

    // lifecycle

    componentWillReceiveProps(nextProps) {
        if (!_.isUndefined(nextProps.value)) {
            this.setState({
                value: _.cloneDeep(nextProps.value)
            });
        }
    },

    // render

    render() {
        let cn = this.className;
        let { pickerType, pickerFocusable, colorFormat } = this.props;
        let { value } = this.state;
        value = value || {};

        var startColor = (value.colors && value.colors[0]) || 'transparent';
        var endColor = (value.colors && value.colors[1]) || 'transparent';
        var style = {
            backgroundImage: 'linear-gradient(to right, ' + startColor + '  0%, ' + endColor + ' 100%)'
        };

        /* jshint ignore:start */
        return <div className={cn()} style={style}>
            <ColorPicker
                className={cn('startColor')}
                type={pickerType}
                format={colorFormat}
                onChange={this.handleStartColorColorChange}
                value={value.colors && value.colors[0]}/>
            <ColorPicker
                className={cn('endColor')}
                type={pickerType}
                format={colorFormat}
                onChange={this.handleEndColorColorChange}
                value={value.colors && value.colors[1]}/>
        </div>;
        /* jshint ignore:end */

    }

});

module.exports = GradientPicker;

styler.registerComponentStyles('GradientPicker', {
    display: 'inline-block',
    verticalAlign: 'middle',
    padding: 5,
    userSelect: 'none',

    '&-startColor': {
        marginRight: 80
    }

});

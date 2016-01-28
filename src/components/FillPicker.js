/**
 * FillPicker
 * complex input for color picker and gradient picker
 *
 * @example
 * <FillPicker />
 */

'use strict';
var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler'),
    RadioList = require('./RadioList'),
    ColorPicker = require('./ColorPicker'),
    GradientPicker = require('./GradientPicker');

var FillPicker = React.createClass({

    displayName: 'FillPicker',

    propTypes: {
        /**
         * value
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
        styler.mixinFor('FillPicker')
    ],

    // init

    getInitialState() {
        let { props } = this;
        return {
            value: _.cloneDeep(_.isUndefined(props.value) ? props.defaultValue : props.value)
        };
    },

    // handlers

    handleTypeChange(e) {
        var value = _.isUndefined(e.target) ? e : e.target.value;
        this.handleChange(value);
    },

    handleColorChange(e) {
        var value = _.isUndefined(e.target) ? e : e.target.value;
        this.handleChange('solid', value);
    },

    handleGradientChange(e) {
        var value = _.isUndefined(e.target) ? e : e.target.value;
        this.handleChange('linearGradient', undefined, value);
    },

    handleChange(type, color, gradient) {
        let { value } = this.state;
        if (!_.isPlainObject(value)) {
            value = {};
        }
        if (!_.isUndefined(color)) {
            value = _.extend({}, value, {color});
        }
        if (!_.isUndefined(gradient)) {
            value = _.extend({}, gradient, {color});
        }
        if (!_.isUndefined(type)) {
            value.type = type;
        }
        this.props.onChange && this.props.onChange({target: {value: value}});
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
        let { value } = this.state;

        /* jshint ignore:start */
        return <span className={cn()}>
            <RadioList
                itemTag='span'
                value={value.type}
                onChange={this.handleTypeChange}
                options={[{
                    label: <ColorPicker onChange={this.handleColorChange} value={value.color}/>,
                    value: 'solid'
                }, {
                    label: <GradientPicker onChange={this.handleGradientChange} value={{colors: value.colors}}/>,
                    value: 'linearGradient'
                }]}
                />
            </span>;
        /* jshint ignore:end */
    }

});

module.exports = FillPicker;

styler.registerComponentStyles('FillPicker', {});

/**
 * Range
 * range input with text box (wrapper on input[type=range])
 *
 * @example
 * <Range suffix="px" />
 */

'use strict';
var React = require('react'),
    _ = require('lodash');

module.exports = React.createClass({

    displayName: 'Range',

    propTypes: {
        /**
         * Suffix for text input box
         */
        suffix: React.PropTypes.string,

        /**
         * Minimum
         */
        min: React.PropTypes.number,

        /**
         * Maximum
         */
        max: React.PropTypes.number,

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

    getDefaultProps: () => ({
        suffix: '',
        min: 0,
        max: 100
    }),

    handleTextBox(event) {
        this.update(event.target.value);
    },

    handleSlider(event) {
        this.update(event.target.value + this.props.suffix);
    },

    update(value) {
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    },

    render() {
        var value = _.isUndefined(this.props.value) ? this.props.defaultValue : this.props.value;

        /* jshint ignore:start */
        return <div className='range'>
            <input type='text' id={this.props.id} value={value} onChange={this.handleTextBox}/>
            <input
                type='range' id={this.props.id} value={parseFloat(value)}
                min={this.props.min} max={this.props.max} onChange={this.handleSlider}
            />
        </div>;
        /* jshint ignore:end */
    }

});

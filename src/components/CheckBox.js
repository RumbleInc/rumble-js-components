/**
 * Checkbox
 *
 * @example
 * <CheckBox />
 */

'use strict';
var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler'),
    stringToBoolean = require('../helpers/stringToBoolean'),
    icons = require('../icons');

var CheckBox = React.createClass({

    displayName: 'CheckBox',

    mixins: [styler.mixinFor('CheckBox')],

    /**
     * This component also supports all properties for INPUT DOM element
     */
    propTypes: {
        /**
         * value (true - checked, false - unchecked)
         */
        value: React.PropTypes.any,

        /**
         * defaultValue
         */
        defaultValue: React.PropTypes.any,

        /**
         * callback function calls on changing value
         */
        onChange: React.PropTypes.func,

        icons: React.PropTypes.oneOf(['native', 'nice', 'toggle'])
    },

    /**
     * init
     */

    getDefaultProps: () => ({
        icons: 'nice'
    }),

    /**
     * handlers
     */

    handleChange(event) {

        if (this.props.onChange) {
            delete event.target.value;
            event.target.value = event.target.checked;
            this.props.onChange(event);
        }
    },

    render() {

        var cn = this.className;

        var checked = _.isString(this.props.value) ?
            stringToBoolean(this.props.value) :
            this.props.value;

        var defaultChecked = _.isString(this.props.defaultValue) ?
            stringToBoolean(this.props.defaultValue) :
            this.props.defaultValue;

        /* jshint ignore:start */
        return <span
            className={cn('', this.props.icons,
            this.props.disabled ? 'disabled' : 'enabled', checked ? 'checked' : 'not-checked')}>
            <input
                {...this.props}
                type='checkbox'
                checked={checked} defaultChecked={defaultChecked}
                value={undefined} defaultValue={undefined}
                onChange={this.props.disabled ? undefined : this.handleChange}
            />
            <span />
        </span>;
        /* jshint ignore:end */

    }

});

module.exports = CheckBox;

styler.registerComponentStyles('CheckBox', {
    display: 'inline-block',
    verticalAlign: 'middle',
    outline: 'none',
    cursor: 'pointer',

    '&-nice': {
        width: 0,
        height: 18,
        marginRight: 18
    },
    '&-nice input': {
        position: 'absolute',
        zIndex: '1',
        width: 18,
        height: 18,
        opacity: 0,
        cursor: 'pointer'
    },
    '&-nice span:before': {
        display: 'block',
        content: '""',
        lineHeight: '18px',
        width: 18,
        height: 18,
        backgroundImage: 'url("' + icons.checkbox_normal + '")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center'
    },
    '&-nice input:checked + span:before': {
        backgroundImage: 'url("' + icons.checkbox_on + '")'
    },
    '&-enabled&-nice input:checked:hover + span:before': {
        backgroundImage: 'url("' + icons.checkbox_hover + '")'
    },

    '&-toggle': {
        width: 0,
        height: 26,
        marginRight: 40
    },
    '&-toggle input': {
        position: 'absolute',
        zIndex: '1',
        width: 40,
        height: 26,
        opacity: 0,
        cursor: 'pointer'
    },
    '&-toggle span:before': {
        position: 'absolute',
        display: 'block',
        content: '""',
        lineHeight: '26px',
        width: 40,
        height: 26,
        borderRadius: 16,
        backgroundColor: '#c9c9c9',
        transition: 'background-color 100ms linear'
    },
    '&-toggle input:hover + span:before': {
        backgroundColor: '#b3b3b3'
    },
    '&-toggle span:after': {
        display: 'block',
        content: '""',
        width: 16,
        height: 16,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        transform: ['translate(5px,5px)'],
        transition: 'transform 100ms linear'
    },
    '&-toggle input:checked + span:before': {
        backgroundColor: '#08a508'
    },
    '&-toggle input:checked:hover + span:before': {
        backgroundColor: '#058e05'
    },
    '&-toggle input:checked + span:after': {
        transform: ['translate(20px,5px)']
    }

});

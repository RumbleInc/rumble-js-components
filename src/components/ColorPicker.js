/**
 * ColorPicker
 * color picker
 *
 * @example
 * <ColorPicker type='photoshop' value='#ff00ff' onChange={e => e.target.value} />
 */

'use strict';
var React = require('react'),
    ReactDOM = require('react-dom'),
    styler = require('react-styler'),
    color = require('color'),
    _ = require('lodash'),
    DropDownContent = require('./DropDownContent'),
    colorHelper = require('react-color/lib/helpers/color'),
    mixinDropDownInput = require('../mixins/mixinDropDownInput');

var pickers = (() => {
    return {
        chrome: require('react-color/lib/components/chrome/Chrome'),
        compact: require('react-color/lib/components/compact/Compact'),
        material: require('react-color/lib/components/material/Material'),
        photoshop: require('react-color/lib/components/photoshop/Photoshop'),
        sketch: require('react-color/lib/components/sketch-2/Sketch'),
        slider: require('react-color/lib/components/slider/Slider'),
        swatches: require('react-color/lib/components/swatches/Swatches')
    };
})();

var ColorPicker = React.createClass({

    displayName: 'ColorPicker',

    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        type: React.PropTypes.oneOf(_.keys(pickers)),
        format: React.PropTypes.oneOf([
            'rgb', 'hsl', 'hsv', 'cmyk',
            'rgbArray', 'hslArray', 'hsvArray', 'cmykArray',
            'hexString', 'rgbString', 'percentString', 'hslString', 'hwbString', 'keyword'
        ]),
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
        styler.mixinFor('ColorPicker'),
        mixinDropDownInput
    ],

    // init

    getDefaultProps() {
        return {
            type: 'photoshop',
            format: 'rgbString'
        };
    },

    // handlers

    handleClick() {
        if (this.state.opened) {
            this.handleAccept();
        } else {
            this.setState({opened: true});
        }
    },

    handleChange(data) {
        data = colorHelper.simpleCheckForValidColor(data);
        if (data) {
            let colors = colorHelper.toState(data, this.state.oldHue);
            this.setState({hoveredValue: color(colors.rgb)[this.props.format](), oldHue: colors.oldHue});
        }
    },

    handleAccept() {
        let value = this.state.hoveredValue || this.state.value;
        this.setValue(value, value && {
                colors: colorHelper.toState(value, this.state.oldHue)
            });
        this.setState({
            opened: false
        });
    },

    handleCancel() {
        this.setState({
            opened: false,
            hoveredValue: undefined
        });
    },

    handleBlur() {
        _.delay(() => {
            var root = ReactDOM.findDOMNode(this);
            var element = document.activeElement;
            while (element && element !== root) {
                element = element.parentNode;
            }
            if (!element) {
                if (this.props.type === 'photoshop') {
                    this.handleCancel();
                } else {
                    this.handleAccept();
                }
            }
        }, 10);
    },

    // render

    render() {
        let cn = this.className;
        let { state, props } = this;
        let { type, disabled, style, width, height } = props;
        let { hoveredValue, value, opened } = state;

        /* jshint ignore:start */
        let Picker = pickers[type];
        let pickerAttributes = colorHelper.toState(hoveredValue || value || {}, this.state.oldHue);

        return <span
            tabIndex={disabled ? undefined : 0} role='button'
            className={cn('',
                    opened ? 'opened' : 'closed',
                    disabled ? 'disabled' : 'enabled'
                )}
            onKeyDown={!disabled && this.handleDropDownInputKeyDown}
            onBlur={!disabled && this.handleBlur}>

            <div className={cn('swatch')} style={style}
                 onClick={!disabled && this.handleClick}
                >
                <div className={cn('color')}
                     style={{width, height, backgroundColor: opened ? (hoveredValue || value) : value}}/>
            </div>

            <DropDownContent
                className={cn('dropdown')} zIndex={100} visible={opened} tabIndex={null}
                onClick={event => event.stopPropagation()}>
                {opened && <Picker
                    {...pickerAttributes}
                    onChange={this.handleChange}
                    onAccept={this.handleAccept}
                    onCancel={this.handleCancel}
                    />}
            </DropDownContent>

        </span>;
        /* jshint ignore:end */
    }

});

module.exports = ColorPicker;

styler.registerComponentStyles('ColorPicker', {
    display: 'inline-block',
    verticalAlign: 'middle',
    userSelect: 'none',

    '&-swatch': {
        padding: 5,
        background: '#fff',
        borderRadius: 1,
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        cursor: 'pointer'
    },

    '&-color': {
        width: 36,
        height: 14,
        borderRadius: 2
    },

    '&-dropdown div': {
        cursor: 'default'
    }

});

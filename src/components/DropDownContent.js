'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    styler = require('react-styler');

var DropDownContent = React.createClass({

    displayName: 'DropDownContent',

    propTypes: {
        enabled: React.PropTypes.bool,
        visible: React.PropTypes.bool,
        zIndex: React.PropTypes.number,
        onHide: React.PropTypes.func,
        onClick: React.PropTypes.func,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        style: React.PropTypes.object,
        tabIndex: React.PropTypes.number,
        arrowAngle: React.PropTypes.number, // degrees
        arrowSize: React.PropTypes.oneOfType([
            React.PropTypes.number, React.PropTypes.bool  // pixels (arrow triangle side),
        ]),
        arrowPosition: React.PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
        arrowOffset: React.PropTypes.number, // pixels, can be negative,
        direction: React.PropTypes.oneOf(['up', 'down', 'smart'])
    },

    mixins: [styler.mixinFor('DropDownContent')],

    /**
     * init
     */

    getDefaultProps: () =>({
        enabled: true,
        zIndex: 100,
        arrowAngle: 70,
        arrowPosition: 'right',
        arrowOffset: 0,
        direction: 'down'
    }),

    // helpers

    adjust() {
        const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if (screenHeight > 0) {
            const node = ReactDOM.findDOMNode(this);
            const {bottom, top, height} = node.getBoundingClientRect();
            const bottomOverflow = bottom - screenHeight; // >0 = overflow
            const topOverflow = height - top; // >0 = overflow
            if (bottomOverflow > 0 && topOverflow < bottomOverflow) {
                node.style.bottom = '100%';
            } else {
                node.style.bottom = 'initial';
            }
        }
    },

    // handlers

    handleClick(event) {
        if (this.props.enabled && this.props.visible) {
            var root = ReactDOM.findDOMNode(this);
            var element = event.target;
            while (element && element !== root) {
                element = element.parentNode;
            }
            if (!element) {
                this.props.onHide && this.props.onHide();
            }
        }
    },

    handleKeyPress(event) {
        if (this.props.onHide && this.props.enabled &&
            this.props.visible && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey &&
            event.keyCode === 27) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            this.props.onHide();
        }
    },

    // lifecycle

    componentDidMount() {
        if (this.props.onHide) {
            document.addEventListener('click', this.handleClick, true);
            document.addEventListener('keydown', this.handleKeyPress, true);
        }
        if (this.props.direction === 'smart' && this.props.visible) {
            this.adjust();
        }
    },

    componentDidUpdate(prevProps) {
        if (this.props.direction === 'smart') {
            if (!prevProps.visible && this.props.visible) {
                this.adjust();
            } else if (prevProps.visible && !this.props.visible) {
                const node = ReactDOM.findDOMNode(this);
                node.style.bottom = 'initial';
            }
        }
    },

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, true);
        document.removeEventListener('keydown', this.handleKeyPress, true);
    },

    // render

    render() {
        var cn = this.className;

        var style = _.extend({
            width: this.props.width,
            height: this.props.height,
            visibility: this.props.visible ? 'visible' : 'hidden',
            zIndex: this.props.enabled ? this.props.zIndex : undefined
        }, this.props.style);

        if (this.props.arrowSize) {
            var skewAngle = 45 - this.props.arrowAngle / 2;
            var sign = '';
            var offsetAttribute = this.props.arrowOffset >= 0 ? 'left' : 'right';
            if (this.props.arrowPosition === 'right' || this.props.arrowPosition === 'left') {
                sign = '-';
                offsetAttribute = this.props.arrowOffset >= 0 ? 'top' : 'bottom';
            }
            var transform = 'rotate(' + sign + '45deg) skew(' + skewAngle + 'deg,' + skewAngle + 'deg)';
            var styleArrow = {
                width: this.props.arrowSize,
                height: this.props.arrowSize,
                transform: transform,
                WebkitTransform: transform
            };
            styleArrow[this.props.arrowPosition] = -this.props.arrowSize / 2;
            styleArrow[offsetAttribute] = Math.abs(this.props.arrowOffset) - this.props.arrowSize / 2;
        }
        if (this.props.direction === 'up' || this.props.direction === 'top') {
            style.bottom = '100%';
        }

        /* jshint ignore:start */
        return <div style={style} className={cn()} onClick={this.props.onClick}
                    tabIndex={_.isUndefined(this.props.tabIndex) ?
                    (this.props.enabled ? 0 : undefined) :
                    this.props.tabIndex}>
            {this.props.arrowSize && <div className={cn('arrow')} style={styleArrow}></div>}
            <div className={cn('content')}>
                {this.props.children}
            </div>
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = DropDownContent;

styler.registerComponentStyles('DropDownContent', {
    position: 'absolute',
    border: '1px solid rgba(219, 219, 219, 1)',
    boxShadow: '0px 0px 10px 0px rgba(219, 219, 219, 0.5)',
    boxSizing: 'border-box',

    '&:focus': {
        outline: 'none'
    },

    '&-arrow': {
        backgroundColor: 'inherit',
        border: 'inherit',
        boxShadow: 'inherit',
        boxSizing: 'inherit',
        display: 'block',
        position: 'absolute'
    },

    '&-content': {
        overflow: 'hidden',
        backgroundColor: 'inherit',
        boxSizing: 'inherit',
        position: 'relative',
        width: '100%',
        height: '100%'
    }
});

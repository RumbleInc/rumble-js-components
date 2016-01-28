'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    getOffset = require('../helpers/getOffset'),
    _ = require('lodash');

var has = function (value, token, isFirst) {
    var values = (_.isString(value) ?
            value.toLowerCase().split(' ') :
            value) || [];
    return isFirst ? values[0] === token : values.indexOf(token) !== -1;
};

var mixinDropDownPosition = {

    propTypes: {
        position: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
        align: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
        target: React.PropTypes.oneOfType([
            React.PropTypes.object, React.PropTypes.string, React.PropTypes.bool, React.PropTypes.func
        ]),
        fixed: React.PropTypes.bool,
        translatePosition: React.PropTypes.bool, // true = for tranform:translate, false = for left/top
        arrowAngle: React.PropTypes.number, // degrees
        arrowSize: React.PropTypes.number // pixels (arrow triangle side),
    },

    // init

    getInitialState: () => ({
        left: 0,
        top: 0
    }),

    // helpers

    show(params, triggerEvent) {

        params = params || {};
        var atPointerPosition = params['atPointerPosition'];
        var position = params.position || this.props.position;
        var align = params.align || this.props.align;

        var left, top;
        if (atPointerPosition && !_.isUndefined(triggerEvent.clientX) && !_.isUndefined(triggerEvent.clientY)) {

            left = triggerEvent.pageX;
            top = triggerEvent.pageY;

        } else if (_.isPlainObject(triggerEvent) &&
            (!_.isUndefined(triggerEvent.left) && !_.isUndefined(triggerEvent.top))) {

            left = triggerEvent.left;
            top = triggerEvent.top;

        } else {

            var target = this.props.fixed ?
                document.documentElement :
                ((triggerEvent && triggerEvent.target) || this.props.target);
            if (_.isFunction(target)) {
                target = target();
            }
            if (!target) {
                target = (ReactDOM.findDOMNode(this) && ReactDOM.findDOMNode(this).parentNode);
            }
            var width = target.clientWidth;
            if (width === 0) {
                width = target.getBoundingClientRect().width;
            }
            var height = target.clientHeight;
            if (height === 0) {
                height = target.getBoundingClientRect().height;
            }
            if (this.props.translatePosition) {
                left = 0;
                top = -height;
            } else {
                let offset = getOffset(target);
                left = offset.left;
                top = offset.top;
            }
            if (has(position, 'center')) {
                left += width / 2;
            } else if (has(position, 'right')) {
                left += width;
            }
            if (has(position, 'middle')) {
                top += height / 2;
            } else if (has(position, 'bottom')) {
                top += height;
            }

        }

        this.setState({
            context: params.context,
            content: params.content,
            style: params.style
        }, () => {

            var root = (_.isString(this.state.root) ? document.querySelector(this.state.root) : this.state.root) ||
                ReactDOM.findDOMNode(this);

            if (has(align, 'center')) {
                left -= root.clientWidth / 2;
            } else if (has(align, 'right')) {
                left -= root.clientWidth;
            }

            if (has(align, 'middle')) {
                top -= root.clientHeight / 2;
            } else if (has(align, 'bottom')) {
                top -= root.clientHeight;
            }

            var arrowPosition, arrowOffset = 0;
            if (this.props.arrowSize) {

                var arrowAngleRadians = (this.props.arrowAngle * Math.PI) / 360;
                var arrowWidth = this.props.arrowSize * Math.sin(arrowAngleRadians) * 2;
                var arrowHeight = this.props.arrowSize * Math.cos(arrowAngleRadians);

                if (has(align, 'center')) {
                    arrowOffset = root.clientWidth / 2;
                    if (has(align, 'top')) {
                        arrowPosition = 'top';
                        top += arrowHeight;
                    } else if (has(align, 'bottom')) {
                        arrowPosition = 'bottom';
                        top -= arrowHeight;
                    }
                } else if (has(align, 'middle')) {
                    arrowOffset = root.clientHeight / 2;
                    if (has(align, 'left')) {
                        arrowPosition = 'left';
                        left += arrowHeight;
                    } else if (has(align, 'right')) {
                        arrowPosition = 'right';
                        left -= arrowHeight;
                    }
                } else if (has(align, 'top', true)) {
                    arrowPosition = 'top';
                    top += arrowHeight;
                    if (has(align, 'left')) {
                        arrowOffset = arrowWidth;
                        left -= arrowWidth;
                    } else if (has(align, 'right')) {
                        arrowOffset = -arrowWidth;
                        left += arrowWidth;
                    }
                } else if (has(align, 'bottom', true)) {
                    arrowPosition = 'bottom';
                    top -= arrowHeight;
                    if (has(align, 'left')) {
                        arrowOffset = arrowWidth;
                        left -= arrowWidth;
                    } else if (has(align, 'right')) {
                        arrowOffset = -arrowWidth;
                        left += arrowWidth;
                    }
                } else if (has(align, 'left', true)) {
                    arrowPosition = 'left';
                    left += arrowHeight;
                    if (has(align, 'top')) {
                        arrowOffset = arrowWidth;
                        top -= arrowWidth;
                    } else if (has(align, 'bottom')) {
                        arrowOffset = -arrowWidth;
                        top += arrowWidth;
                    }
                } else if (has(align, 'right', true)) {
                    arrowPosition = 'right';
                    left -= arrowHeight;
                    if (has(align, 'top')) {
                        arrowOffset = arrowWidth;
                        top -= arrowWidth;
                    } else if (has(align, 'bottom')) {
                        arrowOffset = -arrowWidth;
                        top += arrowWidth;
                    }
                }

            }

            this.setState({
                visible: true,
                left: left,
                top: top,
                arrowPosition: arrowPosition,
                arrowOffset: arrowOffset
            });

        });
    },

    hide() {
        this.isMounted() && this.setState({
            visible: false
        });
    },

    isVisible() {
        return this.state.visible;
    }

};

module.exports = mixinDropDownPosition;

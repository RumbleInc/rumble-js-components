'use strict';

var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler');

var images = {
    balls: '<svg class="icon-loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" ' +
    'width="32" height="32" fill="white">' +
    '<path transform="translate(-8 0)" d="M4 12 A4 4 0 0 0 4 20 A4 4 0 0 0 4 12">' +
    '<animateTransform attributeName="transform" type="translate" values="-8 0; 2 0; 2 0;" dur="0.8s" ' +
    'repeatCount="indefinite" begin="0" keytimes="0;.25;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8" ' +
    'calcMode="spline"  />' +
    '</path>' +
    '<path transform="translate(2 0)" d="M4 12 A4 4 0 0 0 4 20 A4 4 0 0 0 4 12">' +
    '<animateTransform attributeName="transform" type="translate" values="2 0; 12 0; 12 0;" dur="0.8s" ' +
    'repeatCount="indefinite" begin="0" keytimes="0;.35;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8" ' +
    'calcMode="spline"  />' +
    '</path>' +
    '<path transform="translate(12 0)" d="M4 12 A4 4 0 0 0 4 20 A4 4 0 0 0 4 12">' +
    '<animateTransform attributeName="transform" type="translate" values="12 0; 22 0; 22 0;" dur="0.8s" ' +
    'repeatCount="indefinite" begin="0" keytimes="0;.45;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8" ' +
    'calcMode="spline"  />' +
    '</path>' +
    '<path transform="translate(24 0)" d="M4 12 A4 4 0 0 0 4 20 A4 4 0 0 0 4 12">' +
    '<animateTransform attributeName="transform" type="translate" values="22 0; 32 0; 32 0;" dur="0.8s" ' +
    'repeatCount="indefinite" begin="0" keytimes="0;.55;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8" ' +
    'calcMode="spline"  />' +
    '</path>' +
    '</svg>',
    bars: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="white">' +
    '<path transform="translate(2)" d="M0 12 V20 H4 V12z">' +
    '<animate attributeName="d" values="M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z" ' +
    'dur="1.2s" repeatCount="indefinite" begin="0" keytimes="0;.2;.5;1" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8" calcMode="spline"  />' +
    '</path>' +
    '<path transform="translate(8)" d="M0 12 V20 H4 V12z">' +
    '<animate attributeName="d" values="M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z" ' +
    'dur="1.2s" repeatCount="indefinite" begin="0.2" keytimes="0;.2;.5;1" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8" calcMode="spline"  />' +
    '</path>' +
    '<path transform="translate(14)" d="M0 12 V20 H4 V12z">' +
    '<animate attributeName="d" values="M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z" ' +
    'dur="1.2s" repeatCount="indefinite" begin="0.4" keytimes="0;.2;.5;1" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8" calcMode="spline" />' +
    '</path>' +
    '<path transform="translate(20)" d="M0 12 V20 H4 V12z">' +
    '<animate attributeName="d" values="M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z" ' +
    'dur="1.2s" repeatCount="indefinite" begin="0.6" keytimes="0;.2;.5;1" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8" calcMode="spline" />' +
    '</path>' +
    '<path transform="translate(26)" d="M0 12 V20 H4 V12z">' +
    '<animate attributeName="d" values="M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z" ' +
    'dur="1.2s" repeatCount="indefinite" begin="0.8" keytimes="0;.2;.5;1" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8" calcMode="spline" />' +
    '</path>' +
    '</svg>',
    bubbles: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="white">' +
    '<circle transform="translate(8 0)" cx="0" cy="16" r="0">' +
    '<animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0"' +
    'keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />' +
    '</circle>' +
    '<circle transform="translate(16 0)" cx="0" cy="16" r="0">' +
    '<animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.3"' +
    'keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />' +
    '</circle>' +
    '<circle transform="translate(24 0)" cx="0" cy="16" r="0">' +
    '<animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.6"' +
    'keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />' +
    '</circle>' +
    '</svg>',
    cubes: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="white">' +
    '<path transform="translate(-8 0)" d="M0 12 V20 H8 V12z">' +
    '<animateTransform attributeName="transform" type="translate" values="-8 0; 2 0; 2 0;" dur="0.8s" ' +
    'repeatCount="indefinite" begin="0" keytimes="0;.25;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8" ' +
    'calcMode="spline"  />' +
    '</path>' +
    '<path transform="translate(2 0)" d="M0 12 V20 H8 V12z">' +
    '<animateTransform attributeName="transform" type="translate" values="2 0; 12 0; 12 0;" dur="0.8s" ' +
    'repeatCount="indefinite" begin="0" keytimes="0;.35;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8" ' +
    'calcMode="spline"  />' +
    '</path>' +
    '<path transform="translate(12 0)" d="M0 12 V20 H8 V12z">' +
    '<animateTransform attributeName="transform" type="translate" values="12 0; 22 0; 22 0;" dur="0.8s" ' +
    'repeatCount="indefinite" begin="0" keytimes="0;.45;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8" ' +
    'calcMode="spline"  />' +
    '</path>' +
    '<path transform="translate(24 0)" d="M0 12 V20 H8 V12z">' +
    '<animateTransform attributeName="transform" type="translate" values="22 0; 32 0; 32 0;" dur="0.8s" ' +
    'repeatCount="indefinite" begin="0" keytimes="0;.55;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8" ' +
    'calcMode="spline"  />' +
    '</path>' +
    '</svg>',
    cylon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="white">' +
    '<path transform="translate(0 0)" d="M0 12 V20 H4 V12z">' +
    '<animateTransform attributeName="transform" type="translate" values="0 0; 28 0; 0 0; 0 0" dur="1.5s" ' +
    'begin="0" repeatCount="indefinite" keytimes="0;0.3;0.6;1" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
    '</path>' +
    '<path opacity="0.5" transform="translate(0 0)" d="M0 12 V20 H4 V12z">' +
    '<animateTransform attributeName="transform" type="translate" values="0 0; 28 0; 0 0; 0 0" dur="1.5s" ' +
    'begin="0.1s" repeatCount="indefinite" keytimes="0;0.3;0.6;1" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
    '</path>' +
    '<path opacity="0.25" transform="translate(0 0)" d="M0 12 V20 H4 V12z">' +
    '<animateTransform attributeName="transform" type="translate" values="0 0; 28 0; 0 0; 0 0" dur="1.5s" ' +
    'begin="0.2s" repeatCount="indefinite" keytimes="0;0.3;0.6;1" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
    '</path>' +
    '</svg>',
    spin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="white">' +
    '<path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"/>' +
    '<path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">' +
    '<animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" ' +
    'repeatCount="indefinite" />' +
    '</path>' +
    '</svg>',
    'spinning-bubbles': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" ' +
    'height="64" fill="white">' +
    '<circle cx="16" cy="3" r="0">' +
    '<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
    '</circle>' +
    '<circle transform="rotate(45 16 16)" cx="16" cy="3" r="0">' +
    '<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.125s" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
    '</circle>' +
    '<circle transform="rotate(90 16 16)" cx="16" cy="3" r="0">' +
    '<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.25s" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
    '</circle>' +
    '<circle transform="rotate(135 16 16)" cx="16" cy="3" r="0">' +
    '<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.375s" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
    '</circle>' +
    '<circle transform="rotate(180 16 16)" cx="16" cy="3" r="0">' +
    '<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.5s" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
    '</circle>' +
    '<circle transform="rotate(225 16 16)" cx="16" cy="3" r="0">' +
    '<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.625s" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
    '</circle>' +
    '<circle transform="rotate(270 16 16)" cx="16" cy="3" r="0">' +
    '<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.75s" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
    '</circle>' +
    '<circle transform="rotate(315 16 16)" cx="16" cy="3" r="0">' +
    '<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.875s" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
    '</circle>' +
    '<circle transform="rotate(180 16 16)" cx="16" cy="3" r="0">' +
    '<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.5s" ' +
    'keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
    '</circle>' +
    '</svg>',
    spokes: '<svg id="loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" ' +
    'width="32" height="32" fill="white">' +
    '<path opacity=".1" d="M14 0 H18 V8 H14 z" transform="rotate(0 16 16)">' +
    '<animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin="0"/>' +
    '</path>' +
    '<path opacity=".1" d="M14 0 H18 V8 H14 z" transform="rotate(45 16 16)">' +
    '<animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin="0.125s"/>' +
    '</path>' +
    '<path opacity=".1" d="M14 0 H18 V8 H14 z" transform="rotate(90 16 16)">' +
    '<animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin="0.25s"/>' +
    '</path>' +
    '<path opacity=".1" d="M14 0 H18 V8 H14 z" transform="rotate(135 16 16)">' +
    '<animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin="0.375s"/>' +
    '</path>' +
    '<path opacity=".1" d="M14 0 H18 V8 H14 z" transform="rotate(180 16 16)">' +
    '<animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin="0.5s"/>' +
    '</path>' +
    '<path opacity=".1" d="M14 0 H18 V8 H14 z" transform="rotate(225 16 16)">' +
    '<animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin="0.675s"/>' +
    '</path>' +
    '<path opacity=".1" d="M14 0 H18 V8 H14 z" transform="rotate(270 16 16)">' +
    '<animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin="0.75s"/>' +
    '</path>' +
    '<path opacity=".1" d="M14 0 H18 V8 H14 z" transform="rotate(315 16 16)">' +
    '<animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin="0.875s"/>' +
    '</path>' +
    '</svg>'
};

var Loading = React.createClass({

    displayName: 'Loading',

    propTypes: {
        type: React.PropTypes.oneOf([
            'balls', 'bars', 'bubbles', 'cubes', 'cylon',
            'spin', 'spinning-bubbles', 'spokes'
        ]),
        top: React.PropTypes.number,
        left: React.PropTypes.number,
        size: React.PropTypes.number,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        visible: React.PropTypes.bool,
        style: React.PropTypes.object
    },

    mixins: [styler.mixinFor('Loading')],

    /**
     * init
     */

    getDefaultProps: () => ({
        type: 'spin',
        size: 32,
        visible: true
    }),

    /**
     * render
     */

    render() {

        var width = this.props.width || this.props.size;
        var height = this.props.height || this.props.size;

        var transform;
        if (!_.isUndefined(this.props.left) && !_.isUndefined(this.props.top)) {
            transform = 'translate(' + (this.props.left - width / 2) + 'px,' + (this.props.top - height / 2) + 'px)';
        } else {
            transform = '';
        }

        var style = _.extend({
            transform: transform,
            WebkitTransform: transform,
            width: width,
            height: height
        }, this.props.style);

        if (!this.props.visible) {
            style.display = 'hidden';
        }

        /* jshint ignore:start */
        return <div className={this.className()} style={style}
                    dangerouslySetInnerHTML={{__html: images[this.props.type]}}></div>;
        /* jshint ignore:end */
    }

});

module.exports = Loading;

styler.registerComponentStyles('Loading', {
    position: 'absolute',
    zIndex: '100000',
    boxSizing: 'content-box',

    '& > svg': {
        width: '100%',
        height: '100%',
        display: 'inline-block'
    }

});

'use strict';

const React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    PromiseLoader = require('./PromiseLoader');

const ViewportLoader = React.createClass({

    displayName: 'ViewportLoader',

    propTypes: {
        deltaX: React.PropTypes.number,
        deltaY: React.PropTypes.number,
        promiseFactory: React.PropTypes.func,
        initialState: React.PropTypes.any,
        children: React.PropTypes.func
    },

    // init

    getDefaultProps() {
        return {
            deltaX: 0,
            deltaY: 0
        };
    },

    getInitialState() {
        return {
            viewed: false
        };
    },

    // helpers

    checkViewport() {
        if (this.state.viewed) {
            return;
        }
        const { deltaX, deltaY } = this.props;
        const node = ReactDOM.findDOMNode(this);
        if (node) {
            const { top, left, height, width } = node.getBoundingClientRect();
            const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            if (top >= (-deltaY - height) &&
                top <= (screenHeight + deltaY) &&
                left >= (-deltaX - width) &&
                left <= (screenWidth + deltaX)) {
                this.setState({viewed: true});
                this.stopListening();
            }
        }
    },

    startListening() {
        window.addEventListener('scroll', this.checkViewport, true);
        window.addEventListener('resize', this.checkViewport, true);
    },

    stopListening() {
        window.removeEventListener('scroll', this.checkViewport, true);
        window.removeEventListener('resize', this.checkViewport, true);
    },

    // lifecycle

    componentDidMount() {
        this.startListening();
        this.checkViewport();
    },

    componentWillUnmount() {
        this.stopListening();
    },

    componentWillReceiveProps() {
        if (this.state.viewed) {
            this.setState({viewed: false}, () => {
                this.startListening();
                this.checkViewport();
            });
        }
    },

    // render

    render() {
        const { initialState, children, promiseFactory } = this.props;
        const { viewed } = this.state;

        /* jshint ignore:start */
        return <PromiseLoader promise={viewed ? promiseFactory() : new Promise(_.noop)} initialState={initialState}>
            {children}
        </PromiseLoader>;
        /* jshint ignore:end */
    }

});

module.exports = ViewportLoader;

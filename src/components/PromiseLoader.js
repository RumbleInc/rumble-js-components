'use strict';

var React = require('react'),
    _ = require('lodash'),
    Promise = require('bluebird');

var PromiseLoader = React.createClass({

    displayName: 'PromiseLoader',

    propTypes: {
        promise: React.PropTypes.object,
        initialState: React.PropTypes.any,
        children: React.PropTypes.func,
        persistent: React.PropTypes.bool
    },

    // init

    getDefaultProps() {
        return {
            initialState: null
        };
    },

    getInitialState() {
        return {
            loading: false,
            data: this.props.initialState,
            error: null
        };
    },

    // helpers

    isLoading() {
        return !!this.state.loading;
    },

    getState() {
        return this.state.data;
    },

    getError() {
        return this.state.error;
    },

    load(promise) {

        this.isMounted() && this.setState({
            error: null,
            loading: true
        });

        return promise && promise.then && promise
                .then(data => {
                    this.isMounted() && this.setState({
                        data,
                        loading: false,
                        error: null
                    });
                    return data;
                })
                .catch(Promise.CancellationError, _.noop)
                .catch(error => {
                    this.isMounted() && this.setState({
                        error,
                        loading: false
                    });
                });
    },

    // lifecycle

    componentDidMount() {
        this.load(this.props.promise);
    },

    componentWillReceiveProps(nextProps) {
        if (!this.props.persistent && this.props.promise !== nextProps.promise) {
            this.load(nextProps.promise);
        }
    },

    // render

    render: function () {
        /* jshint ignore:start */
        return this.props.children({
            isLoading: this.isLoading,
            getState: this.getState,
            getError: this.getError
        }, this.props);
        /* jshint ignore:end */
    }

});

module.exports = PromiseLoader;

'use strict';

var _ = require('lodash'),
    Promise = require('bluebird');

var mixinLoadData = function (loadFunction, params) {

    params = params || {};
    var dataState = params['dataState'] || ('data' + (params['suffix'] || ''));
    var loadingState = params['loadingState'] || ('loading' + (params['suffix'] || ''));
    var errorState = params['errorState'] || ('error' + (params['suffix'] || ''));
    var emptyState = params['emptyState'] || ('empty' + (params['suffix'] || ''));

    var load = function (props, context) {

        var promise = loadFunction.call(this, props, context);
        if (!promise) {
            return;
        }
        var state = {};
        state[errorState] = null;
        state[loadingState] = true;
        state[emptyState] = null;
        this.setState(state);
        return promise
            .then((data) => {
                var pipe = params.pipe || params;
                var state = {};
                state[loadingState] = false;
                state[errorState] = null;
                state[emptyState] = _.isEmpty(data);
                state[dataState] = _.isFunction(pipe) ? pipe.call(this, data) : data;
                this.isMounted() && this.setState(state);
                return state[dataState];
            })
            .catch(Promise.CancellationError, _.noop)
            .catch((error) => {
                var state = {};
                console.warn(error);
                state[loadingState] = false;
                state[errorState] = error || true;
                this.isMounted() && this.setState(state);
            });
    };

    var mixinObject = {

        /**
         * lifecycle
         */

        componentWillMount() {
            load.call(this, this.props, this.context);
        },

        componentWillReceiveProps(nextProps, nextContext) {
            load.call(this, nextProps, nextContext);
        }

    };

    if (params['loaderName']) {
        mixinObject[params['loaderName']] = load;
    }

    return mixinObject;

};

module.exports = mixinLoadData;

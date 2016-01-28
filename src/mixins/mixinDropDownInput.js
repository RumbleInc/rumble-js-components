'use strict';

var React = require('react'),
    _ = require('lodash');

var mixinDropDownInput = {

    propTypes: {
        value: React.PropTypes.any,
        defaultValue: React.PropTypes.any,
        hoveredValue: React.PropTypes.any,
        opened: React.PropTypes.bool,
        onChange: React.PropTypes.func
    },

    // init

    getInitialState() {
        return {
            opened: this.props.opened,
            value: _.isUndefined(this.props.value) ? this.props.defaultValue : this.props.value,
            hoveredValue: undefined
        };
    },

    // helpers

    setValue(value, extra = {}) {
        if (!_.isEqual(value, this.state.value)) {
            this.props.onChange && this.props.onChange({target: _.defaults({value: value}, extra)});
            this.setState({
                value: value,
                hoveredValue: undefined
            });
        }
    },

    // handlers

    handleDropDownInputKeyDown(onKeyDown, event) {

        if (!_.isFunction(onKeyDown) || !onKeyDown(event)) {

            if (!_.isFunction(onKeyDown)) {
                event = onKeyDown;
            }

            if (!event.ctrlKey && !event.metaKey && !event.altKey) {

                if (this.state.opened) {

                    if (event.keyCode === 27 || event.keyCode === 9) {

                        event.preventDefault();
                        event.stopPropagation();
                        this.setState({opened: false});

                    } else if (event.keyCode === 13) {

                        event.preventDefault();
                        event.stopPropagation();
                        this.setState({opened: false});
                        if (!_.isUndefined(this.state.hoveredValue)) {
                            this.setValue(this.state.hoveredValue);
                        }

                    }

                } else {

                    if (event.keyCode === 32 || event.keyCode === 13) {
                        event.preventDefault();
                        event.stopPropagation();
                        this.setState({opened: true});
                    }

                }
            }

        }

    },

    handleDropDownInputBlur() {
        this.setState({
            opened: false,
            hoveredValue: undefined
        });
    },

    handleDropDownInputClick() {
        this.setState({opened: !this.state.opened});
    },

    // lifecycle

    componentWillReceiveProps(nextProps) {
        if (!_.isUndefined(nextProps.value)) {
            this.setState({value: nextProps.value});
        }
    }

};

module.exports = mixinDropDownInput;

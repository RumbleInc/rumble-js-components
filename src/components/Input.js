'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    Icon = require('./Icon'),
    styler = require('react-styler');

var Input = React.createClass({

    displayName: 'Input',

    /**
     * This component also supports all properties for INPUT DOM element
     */
    propTypes: {
        allowClear: React.PropTypes.bool,
        onClickClear: React.PropTypes.func,

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

    mixins: [styler.mixinFor('Input')],

    /**
     * init
     */

    getInitialState() {
        var value = _.isUndefined(this.props.value) ? this.props.defaultValue : this.props.value;
        return {
            value: value
        };
    },

    /**
     * helpers
     */

    clear() {
        this.isMounted() && this.setState({value: ''}, () => {
            ReactDOM.findDOMNode(this.refs['input']).focus();
        });
        this.props.onChange && this.props.onChange({target: {value: ''}});
    },

    /**
     * handlers
     */

    handleClickClear() {
        this.clear();
        this.props.onClickClear && this.props.onClickClear();
    },

    handleKeyDown(event) {
        if (!event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && event.keyCode === 27) {
            event.preventDefault();
            if (ReactDOM.findDOMNode(this.refs['input']).value !== '') {
                this.clear();
            } else {
                this.props.onClickClear && this.props.onClickClear();
            }
        }
    },

    handleChange(event) {
        this.isMounted() && this.setState({value: event.target.value});
        this.props.onChange && this.props.onChange(event);
    },

    /**
     * lifecycle
     */

    componentWillReceiveProps(nextProps) {
        if (!_.isUndefined(nextProps.value)) {
            this.setState({
                value: nextProps.value
            });
        }
    },

    /**
     * render
     */

    render() {
        var cn = this.className;

        /* jshint ignore:start */
        return <span className={cn()} onKeyDown={this.props.allowClear && this.handleKeyDown}>
            {this.props.type === 'textarea' ?
                <textarea
                    ref='input' {...this.props} className={cn('input')}
                    value={this.state.value} onChange={this.handleChange}/> :
                <input
                    ref='input' {...this.props} className={cn('input')}
                    value={this.state.value} onChange={this.handleChange}/>}
            {!_.isEmpty(this.state.value) && this.props.allowClear &&
            <Icon className={cn('clear-icon')} icon='trash' title='Clear' onClick={this.handleClickClear}/>}
        </span>;
        /* jshint ignore:end */
    }

});

module.exports = Input;

var placeholder = {
    fontStyle: 'italic',
    color: '#989898'
};

styler.registerComponentStyles('Input', {
    '&-input': {
        height: 35,
        lineHeight: '27px',
        padding: 4,
        boxSizing: 'border-box',
        fontSize: 15,
        border: '1px solid rgb(219, 219, 219)',
        outline: 'none',
        color: '#474747',
        fontFamily: 'inherit',
        borderRadius: 1,
        boxShadow: 'inset 0px 1px 1px 0px rgba(229, 229, 229, 0.5)'
    },
    '&-input:focus': {
        border: '1px solid #a3b8f7'
    },
    '&-input::-webkit-input-placeholder': placeholder,
    '&-input::-moz-placeholder': placeholder,
    '&-input:-moz-placeholder': placeholder,
    '&-input:-ms-input-placeholder': placeholder,

    '& textarea': {
        height: 120,
        lineHeight: '1.2em',
        padding: '7px 4px'
    },

    '&-clear-icon': {
        marginLeft: -21
    }
});

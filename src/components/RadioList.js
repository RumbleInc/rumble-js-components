'use strict';

var React = require('react'),
    _ = require('lodash'),
    icons = require('../icons'),
    styler = require('react-styler');

var radiolistCounter = 0;

var RadioList = React.createClass({

    displayName: 'RadioList',

    propTypes: {
        options: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.node,
            value: React.PropTypes.any
        })),

        name: React.PropTypes.string,
        itemTag: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        readOnly: React.PropTypes.bool,
        icons: React.PropTypes.oneOf(['native', 'nice']),

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

    mixins: [styler.mixinFor('RadioList')],

    /**
     * init
     */

    getDefaultProps: () => ({
        icons: 'nice',
        itemTag: 'label'
    }),

    getInitialState() {
        var value = _.isUndefined(this.props.value) ? this.props.defaultValue : this.props.value;
        return {
            value: value
        };
    },

    /**
     * handlers
     */

    handleChange(value) {
        if (value.target) {
            value = value.target.value;
        }
        if (this.state.value !== value) {
            this.props.onChange && this.props.onChange({target: {value: value}});
        }
        this.setState({
            value: value
        });
    },

    /**
     * lifecycle
     */

    componentWillMount() {
        radiolistCounter++;
    },

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
        var name = this.props.name || ('radiolist' + radiolistCounter);

        var ItemTag = this.props.itemTag || 'label';

        /* jshint ignore:start */
        return <div className={cn('', this.props.icons)}>
            {_.map(this.props.options, (item, index) => (
                <ItemTag
                    key={index}
                    className={cn('item', this.state.value === item.value ? 'item-checked' : 'item-unchecked')}
                    onClick={!this.props.disabled && this.handleChange.bind(this, item.value)}>
                    <input
                        type='radio' name={name} value={item.value} checked={this.state.value === item.value}
                        onChange={_.noop} disabled={this.props.disabled} readOnly={this.props.readOnly}/>
                    <span
                        className={cn('marker',this.state.value === item.value ? 'radio-checked' : 'radio-unchecked')}
                    />
                    {item.label}
                </ItemTag>
            ))}
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = RadioList;

styler.registerComponentStyles('RadioList', {
    display: 'inline-block',
    verticalAlign: 'middle',

    '&-native &-item > input[type=radio]': {
        display: 'inline-block',
        outline: 'none',
        width: 'auto',
        marginRight: 5
    },
    '&-native &-marker': {
        display: 'none'
    },

    '&-nice &-item > input': {
        position: 'absolute',
        zIndex: '1',
        width: 15,
        height: 15,
        opacity: 0,
        cursor: 'pointer'
    },
    '&-nice &-marker': {
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: 10
    },
    '&-nice &-item > input + &-marker:before': {
        display: 'block',
        content: '""',
        marginTop: -4,
        lineHeight: '15px',
        width: 15,
        height: 15,
        visibility: 'visible',
        backgroundImage: 'url("' + icons.radio_normal + '")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center'
    },
    '&-nice &-item > input:hover &-marker:before, &-nice &-item:hover &-marker:before': {
        backgroundImage: 'url("' + icons.radio_hover + '")'
    },
    '&-nice &-item > input:checked &-marker:before, &-nice &-item-checked &-marker:before': {
        backgroundImage: 'url("' + icons.radio_on + '") !important'
    },

    '&-item': {
        display: 'inline-block',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    },

    '&-item + &-item': {
        marginLeft: 20
    },

    '&-item-checked': {
        color: '#4972ee'
    }

});

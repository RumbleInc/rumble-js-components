'use strict';

var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler'),
    Icon = require('./Icon');

var Button = React.createClass({

    displayName: 'Button',

    propTypes: {
        caption: React.PropTypes.node,
        onClick: React.PropTypes.func,
        width: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        primaryIcon: React.PropTypes.string,
        secondaryIcon: React.PropTypes.string,
        tag: React.PropTypes.string,
        title: React.PropTypes.string,
        disabled: React.PropTypes.bool,

        size: React.PropTypes.oneOf(['small', 'medium', 'large', 'default', 'medium-wide', 'large-wide']),
        type: React.PropTypes.oneOf(['save', 'cancel', 'send', 'input', 'add', 'menu', 'open', 'close', 'warning'])
    },

    mixins: [styler.mixinFor('Button')],

    /**
     * init
     */

    getDefaultProps: () => ({
        size: 'medium',
        type: 'save',
        tag: 'div'
    }),

    // handlers

    handleKeyDown(event) {
        if (!this.props.disabled && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey &&
            (event.keyCode === 32 || event.keyCode === 13)) {
            this.props.onClick && this.props.onClick(event);
        }
    },

    /**
     * render
     */

    render() {
        var cn = this.className;

        var style = _.extend({
            width: this.props.width
        }, this.props.style);

        var classes = ['', this.props.size, this.props.type];
        if (this.props.disabled) {
            classes.push('disabled');
        }

        /* jshint ignore:start */
        var Tag = this.props.tag;
        return <Tag
            className={cn(classes)} style={style}
            onClick={!this.props.disabled && this.props.onClick}
            onKeyDown={this.handleKeyDown}
            tabIndex={!this.props.disabled ? 0 : undefined} title={this.props.title}>
            {this.props.primaryIcon && <Icon className={cn('icon-primary')} icon={this.props.primaryIcon}/>}
            {this.props.caption && <span className={cn('caption')}>{this.props.caption}</span>}
            {this.props.secondaryIcon && <Icon className={cn('icon-secondary')} icon={this.props.secondaryIcon}/>}
        </Tag>;
        /* jshint ignore:end */
    }

});

module.exports = Button;

styler.registerComponentStyles('Button', {
    display: 'inline-flex',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
    verticalAlign: 'middle',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
    borderRadius: 2,

    '&-caption': {},

    '&-disabled': {
        border: '1px solid transparent',
        backgroundColor: '#dbdbdb',
        color: '#ffffff',
        cursor: 'default'
    },

    // types

    '&-save:not(&-disabled)': {
        border: '1px solid transparent',
        backgroundColor: '#4972f0',
        color: '#ffffff'
    },
    '&-cancel:not(&-disabled)': {
        border: '1px solid transparent',
        backgroundColor: '#ffffff',
        color: '#474747'
    },
    '&-cancel&-disabled': {
        backgroundColor: '#ffffff',
        color: '#dbdbdb'
    },

    '&-send:not(&-disabled)': {
        border: '1px solid transparent',
        backgroundColor: '#07a508',
        color: '#ffffff'
    },

    '&-input:not(&-disabled)': {
        border: '1px solid rgb(219, 219, 219)',
        backgroundColor: '#ffffff',
        color: '#999999'
    },

    '&-add:not(&-disabled)': {
        border: '1px dashed #a3b8f7',
        backgroundColor: '#d1dcfc',
        color: '#4973ec',
        boxShadow: '0 1px 0 0 #e4e4e4'
    },

    '&-menu': {
        border: '1px solid transparent',
        backgroundColor: '#ffffff',
        color: '#474747',
        fontSize: 15,
        lineHeight: '15px',
        padding: '7px 11px'
    },
    '&-menu:hover': {
        backgroundColor: '#ebeffb',
        color: '#4972f0'
    },
    '&-menu &-icon-primary': {
        marginRight: 11
    },
    '&-menu &-icon-secondary': {
        marginLeft: 11
    },

    '&-open': {
        border: '1px solid #a4b8f7',
        backgroundColor: '#ffffff',
        color: '#4872ef',
        fontSize: 15,
        fontWeight: 400,
        lineHeight: '15px',
        padding: '7px 11px'
    },
    '&-open:hover': {
        backgroundColor: '#ebeffa',
        color: '#113399'
    },
    '&-open &-icon-primary': {
        marginRight: 11
    },
    '&-open &-icon-secondary': {
        marginLeft: 11
    },

    '&-close': {
        border: '1px solid #a4b8f7',
        backgroundColor: '#ebeffa',
        color: '#4872ef',
        fontSize: 15,
        fontWeight: 400,
        lineHeight: '15px',
        padding: '7px 11px'
    },
    '&-close:hover': {
        backgroundColor: '#d1dbfb',
        color: '#113399'
    },
    '&-close &-icon-primary': {
        marginRight: 11
    },
    '&-close &-icon-secondary': {
        marginLeft: 11
    },

    '&-warning:not(&-disabled)': {
        border: '1px solid transparent',
        backgroundColor: '#ea2a29',
        color: '#ffffff',
        boxShadow: '0 1px 0 0 #e4e4e4'
    },

    // sizes

    '&-small': {
        fontSize: 13,
        lineHeight: '13px',
        padding: '8px 20px'
    },
    '&-small:active:not(&-disabled)': {
        paddingTop: 9,
        paddingBottom: 7
    },
    '&-small &-icon-primary': {
        marginRight: 8
    },
    '&-small &-icon-secondary': {
        marginLeft: 8
    },

    '&-medium': {
        fontSize: 15,
        lineHeight: '15px',
        padding: '10px 20px'
    },
    '&-medium:active:not(&-disabled)': {
        paddingTop: 11,
        paddingBottom: 9
    },
    '&-medium &-icon-primary': {
        marginRight: 12
    },
    '&-medium &-icon-secondary': {
        marginLeft: 12
    },

    '&-medium-wide': {
        fontSize: 15,
        lineHeight: '15px',
        padding: '10px 35px'
    },
    '&-medium-wide:active:not(&-disabled)': {
        paddingTop: 11,
        paddingBottom: 9
    },
    '&-medium-wide &-icon-primary': {
        marginRight: 12
    },
    '&-medium-wide &-icon-secondary': {
        marginLeft: 12
    },

    '&-large': {
        fontSize: 15,
        lineHeight: '15px',
        padding: '14px 20px'
    },
    '&-large:active:not(&-disabled)': {
        paddingTop: 15,
        paddingBottom: 13
    },
    '&-large &-icon-primary': {
        marginRight: 12
    },
    '&-large &-icon-secondary': {
        marginLeft: 20
    },

    '&-large-wide': {
        fontSize: 15,
        lineHeight: '15px',
        padding: '14px 35px'
    },
    '&-large-wide:active:not(&-disabled)': {
        paddingTop: 15,
        paddingBottom: 13
    },
    '&-large-wide &-icon-primary': {
        marginRight: 20
    },
    '&-large-wide &-icon-secondary': {
        marginLeft: 20
    }

});

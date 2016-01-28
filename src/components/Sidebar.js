'use strict';

var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler');

var Sidebar = React.createClass({

    displayName: 'Sidebar',

    propTypes: {
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            caption: React.PropTypes.string.isRequired,
            subCaption: React.PropTypes.string,
            onClick: React.PropTypes.func,
            disabled: React.PropTypes.bool,
            active: React.PropTypes.bool,
            href: React.PropTypes.string
        }))
    },

    mixins: [styler.mixinFor('Sidebar')],

    /**
     * render
     */

    render() {
        var cn = this.className;
        /* jshint ignore:start */
        return <div className={cn()}>
            {_.map(this.props.items, (item, index) => {
                var classes = ['item', item.disabled ? 'item-disabled' : 'item-enabled'];
                if (item.active) {
                    classes.push('item-active');
                }
                var className = cn(classes);
                if (item.href) {
                    return <a key={index} className={className} href={item.href} onClick={item.onClick}>
                        <span className={cn('caption')}>{item.caption}</span>
                        {item.subCaption && <span className={cn('sub-caption')}>{item.subCaption}</span>}
                    </a>
                } else {
                    return <div key={index} className={className} onClick={item.onClick}>
                        <span className={cn('caption')}>{item.caption}</span>
                        {item.subCaption && <span className={cn('sub-caption')}>{item.subCaption}</span>}
                    </div>;
                }
            })}
            {this.props.children}

        </div>;
        /* jshint ignore:end */
    }

});

module.exports = Sidebar;

styler.registerComponentStyles('Sidebar', {
    width: 191,
    minHeight: '100vh',
    padding: '0 10px',
    boxSizing: 'border-box',
    borderRight: '1px solid #dcddde',

    '&-item': {
        lineHeight: '16px',
        padding: '12px 0',
        display: 'block',
        textDecoration: 'none'
    },
    '&-item-disabled': {
        color: '#dcddde',
        fontStyle: 'italic'
    },
    '&-item-enabled': {
        color: '#747474',
        cursor: 'pointer'
    },
    '&-item-enabled:hover': {
        color: '#474747'
    },
    '&-item-active': {
        color: '#474747',
        fontFamily: 'GothamMedium, "Helvetica Neue", Helvetica, Arial, sans-serif'
    },

    '&-caption': {
        fontSize: 16,
        whiteSpace: 'nowrap',
        display: 'block'
    },
    '&-sub-caption': {
        fontSize: 12,
        whiteSpace: 'nowrap',
        display: 'block'
    }

});

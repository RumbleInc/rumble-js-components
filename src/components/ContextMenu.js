'use strict';

var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler'),
    DropDownContent = require('./DropDownContent'),
    mixinDropDownPosition = require('../mixins/mixinDropDownPosition'),
    Button = require('./Button');

var ContextMenu = React.createClass({

    displayName: 'ContextMenu',

    propTypes: {
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            caption: React.PropTypes.string.isRequired,
            onClick: React.PropTypes.func,
            icon: React.PropTypes.string,
            disabled: React.PropTypes.bool,
            active: React.PropTypes.bool
        }))
    },

    mixins: [styler.mixinFor('ContextMenu'), mixinDropDownPosition],

    /**
     * init
     */

    getDefaultProps: () => ({
        position: 'middle left',
        align: 'right top',
        arrowSize: 12,
        arrowAngle: 70
    }),

    /**
     * handler
     */

    handleClickItem(onClick) {
        if (!onClick(this.state.context)) {
            this.hide();
        }
    },

    /**
     * render
     */

    render() {
        var cn = this.className;

        var style = _.extend({}, this.props.style, this.state.style, {
            left: this.state.left,
            top: this.state.top
        });

        /* jshint ignore:start */
        return <DropDownContent
            className={cn()} style={style} onHide={this.hide} visible={this.state.visible} zIndex={300}
            arrowAngle={this.props.arrowAngle} arrowSize={this.props.arrowSize}
            arrowPosition={this.state.arrowPosition} arrowOffset={this.state.arrowOffset}
        >
            {_.map(this.props.items, (item, index) => (
                <Button
                    className={cn('item')} key={index} type='menu' size='default' width='100%'
                    caption={item.caption} primaryIcon={item.icon}
                    onClick={item.onClick && this.handleClickItem.bind(this, item.onClick)}
                    disabled={item.disabled}/>
            ))}
        </DropDownContent>;
        /* jshint ignore:end */
    }

});

module.exports = ContextMenu;

styler.registerComponentStyles('ContextMenu', {
    visibility: 'hidden',
    position: 'absolute',
    display: 'block',
    width: 180,
    backgroundColor: '#ffffff',

    boxSizing: 'border-box',
    fontSize: 15,
    lineHeight: '30px',

    '&-item': {
        justifyContent: 'flex-start'
    },

    '& .DropDownContent-content': {
        padding: '4px 0'
    },

    '& .Button-icon-primary': {
        width: 23
    }

});

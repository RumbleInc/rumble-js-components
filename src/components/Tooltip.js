'use strict';

var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler'),
    DropDownContent = require('./DropDownContent'),
    mixinDropDownPosition = require('../mixins/mixinDropDownPosition');

var Tooltip = React.createClass({

    displayName: 'Tooltip',

    mixins: [styler.mixinFor('Tooltip'), mixinDropDownPosition],

    /**
     * init
     */

    getDefaultProps: () => ({
        position: 'top center',
        align: 'bottom center',
        arrowSize: 12,
        arrowAngle: 70
    }),

    /**
     * render
     */

    render() {
        var cn = this.className;

        var style = _.extend({}, this.props.style, this.state.style, this.props.translatePosition ? {
            transform: 'translate3d(' + this.state.left + 'px,' + this.state.top + 'px,0px)'
        } : {
            left: this.state.left,
            top: this.state.top
        });

        /* jshint ignore:start */
        return <DropDownContent
            className={cn()} style={style} onHide={this.hide} visible={this.state.visible} zIndex={200}
            arrowAngle={this.props.arrowAngle} arrowSize={this.props.arrowSize}
            arrowPosition={this.state.arrowPosition} arrowOffset={this.state.arrowOffset}>
            {this.state.content}
        </DropDownContent>;
        /* jshint ignore:end */
    }

});

module.exports = Tooltip;

styler.registerComponentStyles('Tooltip', {
    visibility: 'hidden',
    position: 'absolute',
    display: 'block',
    backgroundColor: '#ffffff',
    borderRadius: 2,
    boxSizing: 'border-box',
    fontSize: 15
});

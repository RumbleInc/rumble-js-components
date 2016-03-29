/**
 * InlineTooltip
 *
 * @example
 * <InlineTooltip>content of tooltip</InlineTooltip>
 *
 * <InlineTooltip timeout={250}>content of tooltip</InlineTooltip>
 *
 * <InlineTooltip style={{padding:20}}>content of tooltip</InlineTooltip>*
 *
 * type can be ['icon','node']
 */

'use strict';
var React = require('react'),
    styler = require('react-styler'),
    Icon = require('./Icon'),
    Tooltip = require('./Tooltip');

var InlineTooltip = React.createClass({

    displayName: 'InlineTooltip',

    propTypes: {
        position: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
        align: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
        target: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.string, React.PropTypes.bool]),
        fixed: React.PropTypes.bool,
        arrowAngle: React.PropTypes.number, // degrees
        arrowSize: React.PropTypes.number, // pixels (arrow triangle side),
        style: React.PropTypes.object,
        icon: React.PropTypes.string,
        iconStyle: React.PropTypes.object,
        timeout: React.PropTypes.number,
        node : React.PropTypes.node,
        type: React.PropTypes.string
    },

    mixins: [styler.mixinFor('InlineTooltip')],

    /**
     * init
     */

    getDefaultProps: () => ({
        type : 'icon',
        icon: 'info',
        position: 'top center',
        align: 'bottom center',
        arrowSize: 12,
        arrowAngle: 70
    }),

    /**
     * handlers
     */

    handleMouseOver(event) {
        clearTimeout(this.timer);
        this.tooltip.show({
            /* jshint ignore:start */
            content: <div style={this.props.style}>{this.props.children}</div>
            /* jshint ignore:end */
        }, event);
    },

    handleMouseOut() {
        if (this.props.timeout) {
            this.timer = setTimeout(() => {
                this.tooltip.hide();
            }, this.props.timeout);
        } else {
            this.tooltip.hide();
        }
    },

    /**
     * render
     */

    render() {
        var cn = this.className;
        /* jshint ignore:start */
        return <div className={cn()}>
            {this.props.type == 'icon' && <Icon
                icon={this.props.icon} style={this.props.iconStyle}
                onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}
            />}
            {this.props.type == 'node' && <div onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>{this.props.node}</div>}
            <Tooltip
                ref={ref => this.tooltip = ref}
                translatePosition={true}
                position={this.props.position}
                align={this.props.align}
                target={this.props.target}
                fixed={this.props.fixed}
                arrowSize={this.props.arrowSize}
                arrowAngle={this.props.arrowAngle}
            />
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = InlineTooltip;

styler.registerComponentStyles('InlineTooltip', {
    display: 'inline-block',
    lineHeight: '100%'
});

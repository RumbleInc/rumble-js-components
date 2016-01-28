'use strict';

var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler');

var Header = React.createClass({

    displayName: 'Header',

    propTypes: {
        innerLeft: React.PropTypes.node,
        innerRight: React.PropTypes.node,
        level: React.PropTypes.number,
        style: React.PropTypes.object,
        title: React.PropTypes.node,
        onClick: React.PropTypes.func
    },

    mixins: [styler.mixinFor('Header')],

    /**
     * init
     */

    getDefaultProps: () => ({
        level: 1,
        title: ''
    }),

    /**
     * render
     */

    render() {

        var cn = this.className;
        var level = Math.min(Math.max(1, this.props.level), 6);

        /* jshint ignore:start */
        var Tag = 'h' + level;
        return <Tag className={cn('', Tag)} style={this.props.style} onClick={this.props.onClick}>
            <span className={cn('caption')}>{this.props.title}</span>
            {this.props.innerLeft && <span className={cn('inner-left')}>
                {this.props.innerLeft}
            </span>}
            {this.props.innerRight && <span className={cn('inner-right')}>
                {this.props.innerRight}
            </span>}
        </Tag>;
        /* jshint ignore:end */
    }

});

module.exports = Header;

styler.registerComponentStyles('Header', {
    display: 'table',
    padding: 0,
    margin: 0,
    fontWeight: 'normal',
    whiteSpace: 'nowrap',
    verticalAlign: 'baseline',
    lineHeight: '1.2em',

    '&-h1': {
        fontSize: 32
    },

    '&-h2': {
        fontSize: 25
    },

    '&-h3': {
        fontSize: 16,
        fontFamily: 'GothamMedium, "Helvetica Neue", Helvetica, Arial, sans-serif'
    },

    '&-caption': {
        display: 'table-cell'
    },

    '&-inner-left': {
        display: 'table-cell',
        fontSize: 20,
        lineHeight: '1.2em',
        paddingLeft: 20,
        verticalAlign: 'baseline'
    },

    '&-inner-right': {
        display: 'table-cell',
        textAlign: 'right',
        width: '100%',
        fontSize: 20,
        lineHeight: '1.2em'
    }

});

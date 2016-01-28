'use strict';

var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler');

var Table = React.createClass({

    displayName: 'Table',

    mixins: [styler.mixinFor('Table')],

    render() {
        var cn = this.className;

        var style = _.extend({
            width: this.props.width,
            height: this.props.height
        }, this.props.style);

        /* jshint ignore:start */
        return <table style={style} className={cn()}>
            {this.props.children}
        </table>;
        /* jshint ignore:end */
    }

});

module.exports = Table;

styler.registerComponentStyles('Table', {
    fontSize: 15,
    borderCollapse: 'separate',
    borderSpacing: 2,

    '& thead th': {
        fontSize: 12,
        color: '#9a9a9a',
        paddingBottom: 7,
        paddingRight: 25,
        textAlign: 'left',
        fontWeight: 'normal'
    },
    '& tbody tr:first-of-type td': {
        borderTop: 'none'
    },
    '& tbody td': {
        padding: '20px 20px 16px',
        backgroundColor: '#f7f7f7',
        borderBottom: '1px solid #ededed',
        borderTop: '12px solid #ffffff'
    },
    '& tbody td:last-of-type': {
        borderRight: 'none'
    }
});

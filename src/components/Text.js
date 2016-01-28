'use strict';

var React = require('react'),
    styler = require('react-styler');

var Text = React.createClass({

    displayName: 'Text',

    propTypes: {
        bold: React.PropTypes.bool,
        tag: React.PropTypes.string,
        style: React.PropTypes.object
    },

    mixins: [styler.mixinFor('Text')],

    /**
     * render
     */

    render() {
        var cn = this.className;
        var classes = [''];
        if (this.props.bold) {
            classes.push('bold');
        }

        var Tag = (this.props.tag && this.props.tag.toLowerCase()) || 'div';
        /* jshint ignore:start */
        return <Tag className={cn(classes)} style={this.props.style}>
            {this.props.children}
        </Tag>;
        /* jshint ignore:end */
    }

});

module.exports = Text;

styler.registerComponentStyles('Text', {
    padding: '15px 0 10px',

    '&-bold': {
        fontWeight: 'bold'
    }
});

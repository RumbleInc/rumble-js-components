'use strict';

var React = require('react'),
    styler = require('react-styler');

var Fieldset = React.createClass({

    displayName: 'Fieldset',

    propTypes: {
        title: React.PropTypes.string,
        style: React.PropTypes.object
    },

    mixins: [styler.mixinFor('Fieldset')],

    /**
     * render
     */

    render() {

        var cn = this.className;

        /* jshint ignore:start */
        return <fieldset className={cn()} style={this.props.style}>
            {this.props.caption && <legend>{this.props.caption}</legend>}
            {this.props.children}
        </fieldset>;
        /* jshint ignore:end */
    }

});

module.exports = Fieldset;

styler.registerComponentStyles('Fieldset', {
    border: '1px solid #dbdbdb',
    padding: '35px 20px 20px',

    '& + &': {
        marginTop: 25
    },

    '& legend': {
        fontFamily: 'GothamMedium, "Helvetica Neue", Helvetica, Arial, sans-serif',
        color: '#474747',
        padding: '0 8px',
        marginLeft: -8
    },

    '& > hr': {
        marginLeft: -20,
        marginRight: -20,
        borderTop: '1px solid #dbdbdb',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none'
    }

});

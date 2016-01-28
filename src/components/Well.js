'use strict';

var React = require('react'),
    styler = require('react-styler');

var Well = React.createClass({

    displayName: 'Well',

    mixins: [styler.mixinFor('Well')],

    render() {
        var cn = this.className;
        /* jshint ignore:start */
        return <div className={cn()} {...this.props}>
            {this.props.children}
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = Well;

styler.registerComponentStyles('Well', {
    border: '1px solid #dbdbdb',
    backgroundColor: '#f7f7f7',
    padding: '12px 18px',
    boxSizing: 'border-box'
});

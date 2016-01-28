'use strict';

var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler');

var FieldRow = React.createClass({

    displayName: 'FieldRow',

    propTypes: {
        style: React.PropTypes.object
    },

    mixins: [styler.mixinFor('FieldRow')],

    /**
     * render
     */

    render() {
        var cn = this.className;

        var style = _.extend({
            width: this.props.width
        }, this.props.style);

        /* jshint ignore:start */
        return <div className={cn()} style={style}>
            <span className={cn('caption')}>
                <span>{this.props.caption}</span>
                {this.props.subCaption && <span className={cn('sub-caption')}>{this.props.subCaption}</span>}
            </span>
            <span className={cn('content')}>
                {this.props.children}
            </span>
            {this.props.hint && <span className={cn('hint')}>{this.props.hint}</span>}
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = FieldRow;

styler.registerComponentStyles('FieldRow', {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'flex-start',

    '& + &': {
        marginTop: 10
    },

    '&-caption': {
        width: 149,
        marginRight: 20,
        flexShrink: '0',
        paddingTop: 8
    },

    '&-sub-caption': {
        fontSize: 13,
        color: '#c4c4c4',
        fontStyle: 'italic',
        display: 'block'
    },

    '&-content': {
        width: 428,
        marginRight: 20,
        flexShrink: '0'
    },

    '&-content input, &-content textarea': {
        width: '100%'
    },

    '&-hint': {
        width: '100%',
        fontSize: 13,
        fontStyle: 'italic',
        paddingTop: 11
    }

});

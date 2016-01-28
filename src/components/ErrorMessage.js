'use strict';

var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler'),
    Icon = require('./Icon');

var ErrorMessage = React.createClass({

    displayName: 'ErrorMessage',

    propTypes: {
        inline: React.PropTypes.bool,
        icon: React.PropTypes.string,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        style: React.PropTypes.object,
        text: React.PropTypes.any,
        description: React.PropTypes.string
    },

    mixins: [styler.mixinFor('ErrorMessage')],

    /**
     * init
     */

    getDefaultProps: () => ({
        icon: 'error_grey_normal',
        inline: false,
        text: ''
    }),

    /**
     * render
     */

    render() {
        var cn = this.className;

        var style = _.extend({
            width: this.props.width,
            height: this.props.height
        }, this.props.style);

        /* jshint ignore:start */
        return <div
            className={cn('', this.props.inline ? 'inline' : 'block')}
            style={style} title={this.props.description}>
            <Icon icon={this.props.icon}/>
            {this.props.text}
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = ErrorMessage;

styler.registerComponentStyles('ErrorMessage', {

    backgroundColor: '#fafafa',
    padding: '12px 18px',
    color: '#747474',
    fontSize: 14,
    fontStyle: 'italic',
    boxSizing: 'border-box',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',

    '&-block': {
        flexDirection: 'column',
        justifyContent: 'center'
    },

    '&-block .Icon': {
        marginBottom: 20
    },

    '&-inline': {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },

    '&-inline .Icon': {
        marginRight: 5
    }

});

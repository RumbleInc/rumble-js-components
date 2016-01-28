'use strict';

var React = require('react'),
    stylist = require('react-styler'),
    Table = require('./Table'),
    CheckBox = require('./CheckBox'),
    Icon = require('./Icon');

var OptionSwitch = React.createClass({

    displayName: 'OptionSwitch',

    propTypes: {
        name: React.PropTypes.string,
        subName: React.PropTypes.string,
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
        onChange: React.PropTypes.func,
        icon: React.PropTypes.string
    },

    mixins: [stylist.mixinFor('OptionSwitch')],

    // init

    getDefaultProps: () => ({
        name: 'default',
        subName: '',
        onChange: null
    }),

    // render

    render() {
        var cn = this.className;
        /* jshint ignore:start */
        return <Table className={cn('table')}>
            <tbody>
            <tr>
                <td className={cn('name')}>
                    <span className={cn('name-title')}>{this.props.name}</span>
                    {this.props.subName != '' && <span className={cn('name-subtitle')}>{this.props.subName}</span>}
                </td>
                {!!this.props.icon && <td className={cn('icon')}>
                    <Icon icon={this.props.icon}/>
                </td>}
                <td className={cn('checkbox')}>
                    <CheckBox icons='toggle' value={this.props.value} disabled={this.props.disabled}
                              onChange={this.props.onChange}/>
                </td>
            </tr>
            </tbody>
        </Table>;
        /* jshint ignore:end */

    }

});

module.exports = OptionSwitch;

stylist.registerComponentStyles('OptionSwitch', {

    '&-name': {
        minWidth: 356,
        verticalAlign: 'middle'
    },
    '&-name-title': {
        display: 'block',
        fontWeight: 'bold'
    },
    '&-name-subtitle': {
        display: 'block',
        fontStyle: 'italic',
        marginTop: 5,
        marginBottom: 3,
        height: 12,
        color: '#999999',
        fontSize: 11
    },
    '&-icon': {
        textAlign: 'center',
        minWidth: 230,
        verticalAlign: 'middle'
    },
    '&-checkbox': {
        textAlign: 'center',
        minWidth: 117,
        verticalAlign: 'middle'
    }
});

/**
 * CheckboxList
 *
 * @example
 * <CheckboxList />
 */

'use strict';
var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler'),
    CheckBox = require('./CheckBox'),
    Input = require('./Input');

module.exports = React.createClass({

    displayName: 'CheckBoxList',

    propTypes: {
        filterVisible: React.PropTypes.bool,
        filterPlaceholder: React.PropTypes.string,
        selectAllCaption: React.PropTypes.string,
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            value: React.PropTypes.string,
            label: React.PropTypes.string
        })),
        value: React.PropTypes.array,
        defaultValue: React.PropTypes.array,
        onChange: React.PropTypes.func,

        /**
         * Groups (group id => group title)
         */
        groups: React.PropTypes.object,

        /**
         * Name of group attribute
         */
        groupAttribute: React.PropTypes.string
    },

    mixins: [styler.mixinFor('CheckBoxList')],

    /**
     * init
     */

    getDefaultProps: () => ({
        groupAttribute: 'type',
        selectAllCaption: 'Select All'
    }),

    getInitialState() {
        var value = (_.isUndefined(this.props.value) ? this.props.defaultValue : this.props.value) || [];
        return {
            value: value,
            allSelected: _.difference(_.pluck(this.props.items, 'value'), value).length === 0
        };
    },

    /**
     * helpers
     */

    setValue(value) {
        this.props.onChange && this.props.onChange({target: {value: value}});
        this.setState({value: value});
    },

    /**
     * handlers
     */

    handleSelectAll(event) {
        event.stopPropagation();
        if (event.target.checked) {
            this.setValue(_.pluck(this.props.items, 'value'));
            this.setState({allSelected: true});
        } else {
            this.setValue([]);
            this.setState({allSelected: false});
        }
    },

    handleChange(event) {
        event.stopPropagation();
        var value = _.clone(this.state.value);
        if (!_.isArray(value)) {
            value = [];
        }
        var rel = event.target.getAttribute('rel');
        var index = this.state.value.indexOf(rel);
        if (index === -1) {
            value.push(rel);
        } else {
            value.splice(index, 1);
        }
        this.setValue(value);
        this.setState({
            allSelected: _.difference(_.pluck(this.props.items, 'value'), value).length === 0
        });
    },

    handleChangeFilter(event) {
        this.setState({
            filter: event.target.value
        });
    },

    /**
     * render
     */

    render() {
        var cn = this.className;

        var list = [];
        _.each(this.props.groups || {'list': ''}, (title, type) => {

            var items;
            if (title) {
                /* jshint ignore:start */
                list.push(<div key={type} className={cn('')}>{title}</div>);
                /* jshint ignore:end */

                var search = {};
                search[this.props.groupAttribute] = type;
                items = _.filter(this.props.items, search);
            } else {
                items = this.props.items;
            }

            _.each(items, (item, index) => {
                if (!this.state.filter || (item.label && item.label.indexOf(this.state.filter) !== -1)) {
                    var checked = this.state.value.indexOf && this.state.value.indexOf(item.value) !== -1;
                    /* jshint ignore:start */
                    list.push(<label key={type + index} className={cn('item')}>
                        <CheckBox rel={item.value} value={checked}/>
                        {item.label}
                    </label>);
                    /* jshint ignore:end */
                }
            });

        });

        /* jshint ignore:start */
        return <div className={cn()}>
            {this.props.filterVisible && <Input
                type='text' ref='filter' placeholder={this.props.filterPlaceholder} value={this.state.filter}
                className={cn('filter')} allowClear={true} onChange={this.handleChangeFilter}
            />}
            <label className={cn('all')}>
                <CheckBox onChange={this.handleSelectAll} value={this.state.allSelected}/>
                {this.props.selectAllCaption}
            </label>
            <div onChange={this.handleChange} className={cn('list')}>
                {list}
            </div>
        </div>;
        /* jshint ignore:end */

    }

});

styler.registerComponentStyles('CheckBoxList', {

    '& .CheckBox': {
        marginRight: 24
    },
    '&-item': {
        marginRight: 12,
        userSelect: 'none'
    },
    '&-all': {
        userSelect: 'none'
    }

});

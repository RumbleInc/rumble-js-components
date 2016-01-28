/**
 * EditableList
 *
 * @example
 * <EditableList
 *   editForm={ContentSourceForm}
 *   viewComponent={ContentSourceRow}
 *   value={this.state.sources}
 *   onChange={this.handleSourcesChange}
 *  />
 */

'use strict';
var React = require('react'),
    _ = require('lodash');

module.exports = React.createClass({

    displayName: 'EditableList',

    propTypes: {
        /**
         * Edit form component (should use props: data, onSubmit, onCancel)
         */
        editForm: React.PropTypes.any,

        /**
         * View component (should use props: data, onEdit, onRemove)
         */
        viewComponent: React.PropTypes.any,

        /**
         * value
         */
        value: React.PropTypes.array,

        /**
         * default value
         */
        defaultValue: React.PropTypes.array,

        /**
         * callback function calls on changing value
         */
        onChange: React.PropTypes.func
    },

    getInitialState() {
        var value = (_.isUndefined(this.props.value) ? this.props.defaultValue : this.props.value) || [];
        return {
            list: value
        };
    },

    componentWillReceiveProps(nextProps) {
        var value = (_.isUndefined(nextProps.value) ? nextProps.defaultValue : nextProps.value) || [];
        this.setState({list: value});
    },

    triggerChange() {
        if (this.props.onChange) {
            var list = _.map(this.state.list, source => _.omit(source, '__inEdit', '__isNew'));
            this.props.onChange({target: {value: list}});
        }
    },

    handleItemCancel(index, e) {
        e.preventDefault();
        var list = this.state.list;
        if (list[index].__isNew) {
            list.splice(index, 1);
        } else {
            list[index].__inEdit = false;
        }
        this.setState({
            list: list
        }, () => {
            this.triggerChange();
        });
    },

    handleItemSave(index, e) {
        var list = this.state.list;
        list[index] = e && e.target && e.target.value || e;
        list[index].__inEdit = false;
        list[index].__isNew = false;
        this.setState({
            list: list
        }, () => {
            this.triggerChange();
        });
    },

    handleItemEdit(index) {
        var list = this.state.list;
        list[index].__inEdit = true;
        this.setState({
            list: list
        }, () => {
            this.triggerChange();
        });
    },

    handleItemRemove(index) {
        var list = this.state.list;
        list.splice(index, 1);
        this.setState({
            list: list
        }, () => {
            this.triggerChange();
        });
    },

    render() {

        var list = {};

        _.each(this.state.list, (item, index) => {

            var result;
            if (item.__inEdit) {
                result = this.props.editForm({
                    data: item,
                    onSubmit: this.handleItemSave.bind(this, index),
                    onCancel: this.handleItemCancel.bind(this, index)
                });
            } else {
                result = this.props.viewComponent({
                    data: item,
                    onEdit: this.handleItemEdit.bind(this, index),
                    onRemove: this.handleItemRemove.bind(this, index)
                });
            }
            list['item-' + index] = result;

        });

        /* jshint ignore:start */
        return <div className='editable-list'>
            {list}
        </div>;
        /* jshint ignore:end */
    }

});

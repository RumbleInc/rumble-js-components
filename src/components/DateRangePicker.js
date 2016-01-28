'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    moment = require('moment'),
    styler = require('react-styler'),
    mixinDropDownInput = require('../mixins/mixinDropDownInput');

require('./DateRangePicker/styles');

var DateRangePicker = React.createClass({

    displayName: 'DateRangePicker',

    propTypes: {
        align: React.PropTypes.string,
        value: React.PropTypes.array,
        presets: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                fromDate: React.PropTypes.any,
                toDate: React.PropTypes.any
            })
        ),
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        style: React.PropTypes.object,
        minDate: React.PropTypes.any,
        maxDate: React.PropTypes.any,
        monthsToShow: React.PropTypes.number
    },

    mixins: [
        styler.mixinFor('DateRangePicker'),
        mixinDropDownInput
    ],

    /**
     * init
     */

    getDefaultProps: () => ({
        align: 'left',
        value: [],
        monthsToShow: 2,
        presets: [
            {
                label: 'Last 7 Days',
                fromDate: moment().subtract(7, 'days'),
                toDate: moment().subtract(1, 'days')
            },
            {
                label: 'Last 30 Days',
                fromDate: moment().subtract(30, 'days'),
                toDate: moment().subtract(1, 'days')
            },
            {
                label: 'This Month',
                fromDate: moment().startOf('month'),
                toDate: moment().endOf('month')
            },
            {
                label: 'Last Month',
                fromDate: moment().subtract(1, 'month').startOf('month'),
                toDate: moment().subtract(1, 'month').endOf('month')
            }
        ]
    }),

    getInitialState: () => ({
        customField: 'from'
    }),

    /**
     * helpers
     */

    isCustomMode(fromDate, toDate) {
        var customMode = true;
        fromDate = moment(fromDate);
        toDate = moment(toDate);
        _.each(this.adjustPresets(this.props.presets), (preset) => {
            if (fromDate.isSame(preset.fromDate, 'day') && toDate.isSame(preset.toDate, 'day')) {
                customMode = false;
            }
        });
        return customMode;
    },

    adjustRange(value) {
        return [
            this.props.minDate ? moment.max(moment(value[0]), moment(this.props.minDate)) : value[0],
            this.props.maxDate ? moment.min(moment(value[1]), moment(this.props.maxDate)) : value[1]
        ];
    },

    adjustPresets(presets) {
        return _.map(presets, (preset) => {
            var limit = this.adjustRange([preset.fromDate, preset.toDate]);
            return {
                label: preset.label,
                fromDate: limit[0],
                toDate: limit[1]
            };
        });
    },

    /**
     * handlers
     */

    handleClickPreset(fromDate, toDate) {
        this.setState({
            customMode: this.isCustomMode(fromDate, toDate),
            hoveredValue: this.adjustRange([moment(fromDate), moment(toDate)]),
            anchorMonth: moment(toDate).clone()
        });
    },

    handleClickCustom() {
        this.setState({
            customMode: true,
            customField: 'from'
        });
    },

    handleClickFrom(event) {
        event.stopPropagation();
        this.setState({
            customMode: true,
            customField: 'from'
        });
    },

    handleClickTo(event) {
        event.stopPropagation();
        this.setState({
            customMode: true,
            customField: 'to'
        });
    },

    handleClickDay(day) {
        var customField,
            hoveredValue,
            value = _.isEmpty(this.state.hoveredValue) ? this.state.value : this.state.hoveredValue;
        if (this.state.customField === 'to') {
            hoveredValue = [value[0], day];
            customField = 'from';
            if (day.isBefore(value[0], 'day')) {
                hoveredValue = [day, day];
            }
        } else {
            hoveredValue = [day, value[1]];
            customField = 'to';
            if (day.isAfter(value[1], 'day')) {
                hoveredValue = [day, day];
            }
        }
        this.setState({
            customField: customField,
            hoveredValue: this.adjustRange(hoveredValue)
        });
    },

    handleClickCancel() {
        this.setState({
            hoveredValue: null,
            opened: false
        });
    },

    handleClickApply() {
        if (_.isArray(this.state.hoveredValue)) {
            var value = this.adjustRange(this.state.hoveredValue);
            var fromDate = value[0];
            var toDate = value[1];
            this.setValue([moment(fromDate).format('YYYY-MM-DD'), moment(toDate).format('YYYY-MM-DD')]);
        }
        this.setState({
            opened: false
        });
    },

    handleClickPrev() {
        this.setState({
            anchorMonth: this.state.anchorMonth.clone().subtract(1, 'months')
        });
    },

    handleClickNext() {
        this.setState({
            anchorMonth: this.state.anchorMonth.clone().add(1, 'months')
        });
    },

    handleBlur() {
        _.delay(() => {
            var root = ReactDOM.findDOMNode(this);
            var element = document.activeElement;
            while (element && element !== root) {
                element = element.parentNode;
            }
            if (element !== root) {
                this.handleDropDownInputBlur();
            }
        });
    },

    /**
     * lifecycle
     */

    componentWillMount() {
        var value = this.state.value;
        if (!_.isArray(value)) {
            value = [value];
        }
        if (this.props.presets && this.props.presets[0]) {
            value[0] = value[0] || this.props.presets[0].fromDate;
            value[1] = value[1] || this.props.presets[0].toDate;
        }
        value = this.adjustRange(value);
        this.setState({
            value: value,
            customMode: this.isCustomMode(value[0], value[1]),
            anchorMonth: value[1].clone().startOf('month')
        });
    },

    /**
     * render
     */

    render: require('./DateRangePicker/render')

});

module.exports = DateRangePicker;

'use strict';

var React = require('react'),
    _ = require('lodash'),
    moment = require('moment'),
    styler = require('react-styler');

var CalendarMonth = React.createClass({

    displayName: 'CalendarMonth',

    propTypes: {
        dayFormat: React.PropTypes.string,
        year: React.PropTypes.number.isRequired,
        month: React.PropTypes.number.isRequired,
        weeksNumber: React.PropTypes.number,
        showPrevDays: React.PropTypes.bool,
        showNextDays: React.PropTypes.bool,
        selected: React.PropTypes.array,
        onClick: React.PropTypes.func,
        style: React.PropTypes.object,
        minDate: React.PropTypes.any,
        maxDate: React.PropTypes.any
    },

    mixins: [styler.mixinFor('CalendarMonth')],

    /**
     * init
     */

    getDefaultProps: () => ({
        dayFormat: 'D',
        weeksNumber: 5,
        selected: []
    }),

    /**
     * helpers
     */

    getDays() {
        var now = moment({year: this.props.year, month: this.props.month}),
            monthStart = now.clone().startOf('month'),
            monthEnd = now.clone().endOf('month'),
            start = now.clone().startOf('month').startOf('week'),
            end = this.props.weeksNumber >= 6 ?
                start.clone().add(this.props.weeksNumber * 7 - 1, 'days') :
                now.clone().endOf('month').endOf('week'),
            today = moment(),
            days = [];

        moment()
            .range(start, end)
            .by('days', day => {
                var item = {
                    day: day,
                    clickable: ((this.props.minDate ?
                            (day.isAfter(this.props.minDate, 'day') || day.isSame(this.props.minDate, 'day')) : true) &&
                        (this.props.maxDate ? (day.isBefore(this.props.maxDate, 'day') ||
                        day.isSame(this.props.maxDate, 'day')) : true)
                    ),
                    label: day.format(this.props.dayFormat),
                    prev: day.isBefore(monthStart, 'day'),
                    next: day.isAfter(monthEnd, 'day'),
                    today: day.isSame(today, 'day')
                };
                _.each(this.props.selected, selected => {
                    if (_.isArray(selected)) {
                        if (day.isBetween(selected[0], selected[1], 'day')) {
                            item.selected = true;
                        }
                        if (day.isSame(selected[0], 'day')) {
                            item.selected = true;
                            item.startRange = true;
                        }
                        if (day.isSame(selected[1], 'day')) {
                            item.selected = true;
                            item.endRange = true;
                        }
                    } else {
                        if (day.isSame(selected, 'day')) {
                            item.selected = true;
                        }
                    }
                });
                days.push(item);
            });

        return days;
    },

    /**
     * handlers
     */

    handleClick(day) {
        this.props.onClick && this.props.onClick(day);
    },

    /**
     * lifecycle
     */

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(this.props, nextProps);
    },

    /**
     * render
     */

    render() {
        var cn = this.className;
        /* jshint ignore:start */
        return <div className={cn()} style={this.props.style}>
            {_.map(this.getDays(), (item, i) => {
                if ((!this.props.showPrevDays && item.prev) ||
                    (!this.props.showNextDays && item.next)) {
                    return <span key={i} className={cn('day')}></span>;
                } else {
                    var list = ['day', item.clickable ? 'day-active' : 'day-inactive'];
                    if (item.selected) {
                        list.push('day-selected');
                    }
                    if (item.startRange) {
                        list.push('day-selected-start');
                    }
                    if (item.endRange) {
                        list.push('day-selected-end');
                    }
                    return <span key={i} className={cn(list)}
                                 onClick={item.clickable && this.handleClick.bind(this, item.day)}>
                        <span className={cn('day-label')}>{item.label}</span>
                    </span>;
                }
            })}
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = CalendarMonth;

styler.registerComponentStyles('CalendarMonth', {
    '&-day': {
        display: 'inline-block',
        width: 30,
        height: 30,
        lineHeight: 30,
        overflow: 'hidden',
        padding: 4,
        verticalAlign: 'middle',
        boxSizing: 'content-box'
    },
    '&-day-active': {
        cursor: 'pointer'
    },
    '&-day-inactive': {
        opacity: '0.5'
    },
    '&-day-label': {
        display: 'block',
        width: 28,
        height: 28,
        border: '1px solid transparent'
    },
    '&-day-active:hover &-day-label': {
        backgroundColor: '#e9f0fa',
        color: '#4872ef'
    },
    '&-day-selected &-day-label': {
        backgroundColor: '#e9f0fa',
        color: '#4872ef'
    },
    '&-day-selected-start &-day-label': {
        backgroundColor: '#bacbf9',
        borderColor: '#a3b8f7',
        color: '#4872ef'
    },
    '&-day-selected-end &-day-label': {
        backgroundColor: '#bacbf9',
        borderColor: '#a3b8f7',
        color: '#4872ef'
    }

});

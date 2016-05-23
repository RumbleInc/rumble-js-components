'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('lodash');
const moment = require('moment');
const styler = require('react-styler');
const mixinDropDownInput = require('../mixins/mixinDropDownInput');
const icons = require('../icons');

const DropDownContent = require('./DropDownContent');
const CalendarMonth = require('./CalendarMonth');
const Icon = require('./Icon');

const DatePicker = React.createClass({

    displayName: 'DatePicker',

    propTypes: {
        align: React.PropTypes.string,
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.instanceOf(Date),
            React.PropTypes.instanceOf(moment)
        ]),
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        style: React.PropTypes.object,
        minDate: React.PropTypes.any,
        maxDate: React.PropTypes.any,
        monthsToShow: React.PropTypes.number
    },

    mixins: [
        styler.mixinFor('DatePicker'),
        mixinDropDownInput
    ],

    // init

    getDefaultProps: () => ({
        align: 'left',
        monthsToShow: 1
    }),

    getInitialState: () => ({}),

    // helpers

    adjust(value) {
        const {minDate, maxDate} = this.props;
        if (minDate) {
            value = moment.max(moment(minDate), moment(value));
        }
        if (maxDate) {
            value = moment.min(moment(maxDate), moment(value));
        }
        return value;
    },

    // handlers

    handleClickDay(day) {
        this.setValue(this.adjust(day).format('YYYY-MM-DD'));
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
            const root = ReactDOM.findDOMNode(this);
            let element = document.activeElement;
            while (element && element !== root) {
                element = element.parentNode;
            }
            if (element !== root) {
                this.handleDropDownInputBlur();
            }
        });
    },

    // lifecycle

    componentWillMount() {
        const value = this.adjust(moment(this.state.value));
        this.setState({
            value: value,
            anchorMonth: value.clone().startOf('month')
        });
    },

    // render

    render() {
        const cn = this.className;

        const {monthsToShow, minDate, maxDate, align} = this.props;
        const {anchorMonth, opened} = this.state;

        const width = this.props.width || this.getStyleProp()['width'];
        const height = this.props.height || this.getStyleProp()['height'];

        const style = _.extend({
            width: width,
            height: height,
            lineHeight: height + 'px'
        }, this.props.style);

        const styleCaption = {
            width: width,
            height: height,
            textAlign: align
        };

        const styleDropDown = {};
        styleDropDown[align] = 0;

        const realValue = this.state.value || [];

        const value = _.isEmpty(this.state.hoveredValue) ? this.state.value : this.state.hoveredValue;

        const selected = [value];

        const months = [];
        moment()
            .range(anchorMonth.clone().subtract(monthsToShow - 1, 'months'), anchorMonth)
            .by('months', (day) => {
                months.push(day);
            });

        return <span
            style={style} tabIndex={0} role='listbox'
            className={cn('', opened ? 'opened' : 'closed')}
            onKeyDown={this.handleDropDownInputKeyDown} onBlur={this.handleBlur}>

            <div style={styleCaption} className={cn('caption')} onClick={this.handleDropDownInputClick}>
                <Icon icon='calendar_normal' className={cn('caption-icon')}/>
                {moment(realValue).format('MMM DD, YYYY')}
            </div>

            <DropDownContent
                style={styleDropDown} className={cn('dropdown')} zIndex={100} visible={opened}
                tabIndex={0} width={(width - 1) * monthsToShow + 1}>

                {_.map(months, (month, index) => {
                    let prevMonth, nextMonth;
                    if (index === 0) {
                        prevMonth = month.clone().subtract(1, 'months');
                        if (minDate && prevMonth.isBefore(minDate, 'month')) {
                            prevMonth = null;
                        }
                    }
                    if (index === months.length - 1) {
                        nextMonth = month.clone().add(1, 'months');
                        if (maxDate && nextMonth.isAfter(maxDate, 'month')) {
                            nextMonth = null;
                        }
                    }

                    return <div key={index} className={cn('panel')}>
                        <div className={cn('panel-header')}>
                            <Icon
                                icon='arrow_left_sml'
                                style={{visibility: prevMonth ? 'inherit' : 'hidden'}}
                                onClick={prevMonth && this.handleClickPrev}
                            />
                            <span className={cn('panel-header-caption')}>{month.format('MMMM YYYY')}</span>
                            <Icon
                                icon='arrow_right_sml'
                                style={{visibility: nextMonth ? 'inherit' : 'hidden'}}
                                onClick={nextMonth && this.handleClickNext}
                            />
                        </div>
                        <CalendarMonth
                            year={month.year()} month={month.month()}
                            minDate={minDate} maxDate={maxDate}
                            selected={selected}
                            onClick={this.handleClickDay}
                        />
                    </div>;

                })}

            </DropDownContent>
        </span>;
    }

});

module.exports = DatePicker;

var width = 300;
var height = 35;

styler.registerComponentStyles('DatePicker', {
    display: 'inline-block',
    width: width,
    height: height,
    lineHeight: height + 'px',
    outline: 'none',
    fontFamily: 'GothamBook, "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: '#464646',
    verticalAlign: 'middle',
    userSelect: 'none',
    cursor: 'default',
    position: 'relative',
    '&-caption': {
        width: width,
        height: height,
        textAlign: 'right',
        zIndex: 101,
        position: 'absolute',
        padding: '0 30px 0 8px',
        boxSizing: 'border-box',
        fontSize: 15,
        border: '1px solid rgb(219, 219, 219)',
        backgroundColor: '#ffffff',
        backgroundImage: 'url("' + icons.arrow_down_normal + '")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center'
    },
    '&:focus &-caption': {
        border: '1px solid #a3b8f7'
    },

    '&-caption:hover': {
        backgroundColor: 'rgb(245, 245, 245)',
        backgroundImage: 'url("' + icons.arrow_down_hover + '")'
    },
    '&-caption-icon': {
        marginRight: 15,
        verticalAlign: 'text-top'
    },
    '&-opened &-caption': {
        backgroundColor: 'rgb(245, 245, 245)'
    },

    '& > &-dropdown': {
        top: height - 1,
        boxShadow: '0px 1px 4px 0px rgba(94, 94, 94, 0.5)',
        backgroundColor: '#ffffff',
        padding: 0,
        display: 'table-row',
        boxSizing: 'border-box',
        fontSize: 15,
        lineHeight: '30px',
        textAlign: 'left'
    },

    '&-panel': {
        display: 'table-cell',
        width: width,
        borderRight: '1px solid #dbdbdb',
        fontSize: 15,
        color: '#464646',
        verticalAlign: 'top',
        textAlign: 'center',
        whiteSpace: 'normal'
    },
    '&-panel:last-of-type': {
        width: width - 1,
        borderRight: 'none'
    },
    '&-dropdown-title': {
        borderBottom: '1px solid #dbdbdb',
        boxSizing: 'border-box',
        marginBottom: 5,
        textAlign: 'left',
        height: height,
        color: '#999999',
        padding: '0 10px',
        lineHeight: Math.ceil(height * 1.1) + 'px'
    },
    '&-panel-header': {
        textTransform: 'uppercase',
        borderBottom: '1px solid #dbdbdb',
        boxSizing: 'border-box',
        margin: '0 0 11px',
        height: height,
        lineHeight: Math.ceil(height * 1.1) + 'px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    '&-panel-header .Icon': {
        padding: '10px 20px'
    }

});

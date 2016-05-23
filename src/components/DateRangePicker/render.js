'use strict';

var React = require('react'),
    _ = require('lodash'),
    moment = require('moment'),
    DropDownContent = require('../DropDownContent'),
    CalendarMonth = require('../CalendarMonth'),
    Icon = require('../Icon');

module.exports = function () {

    var cn = this.className;

    var width = this.props.width || this.getStyleProp()['width'];
    var height = this.props.height || this.getStyleProp()['height'];

    var style = _.extend({
        width: width,
        height: height,
        lineHeight: height + 'px'
    }, this.props.style);

    var styleCaption = {
        width: width,
        height: height,
        textAlign: this.props.align
    };

    var styleDropDown = {};
    styleDropDown[this.props.align] = 0;

    var realValue = this.state.value || [];

    var value = _.isEmpty(this.state.hoveredValue) ? this.state.value : this.state.hoveredValue;

    var fromDate = moment(value[0]);
    var toDate = moment(value[1]);

    var selected = [value];

    var months = [];
    moment().range(
        this.state.anchorMonth.clone().subtract(this.props.monthsToShow - 1, 'months'),
        this.state.anchorMonth
    )
        .by('months', (day) => {
            months.push(day);
        });

    /* jshint ignore:start */
    var calendars = _.map(months, (month, index) => {
        var prevMonth, nextMonth;
        if (index === 0) {
            prevMonth = month.clone().subtract(1, 'months');
            if (this.props.minDate && prevMonth.isBefore(this.props.minDate, 'month')) {
                prevMonth = null;
            }
        }
        if (index === months.length - 1) {
            nextMonth = month.clone().add(1, 'months');
            if (this.props.maxDate && nextMonth.isAfter(this.props.maxDate, 'month')) {
                nextMonth = null;
            }
        }

        return <div key={index} className={cn('panel')} style={{display: this.state.customMode ? undefined : 'none'}}>
            <div className={cn('panel-header')}>
                <Icon icon='arrow_left_sml' style={{visibility: prevMonth ? 'inherit' : 'hidden'}}
                      onClick={prevMonth && this.handleClickPrev}
                />
                <span className={cn('panel-header-caption')}>{month.format('MMMM YYYY')}</span>
                <Icon icon='arrow_right_sml' style={{visibility: nextMonth ? 'inherit' : 'hidden'}}
                      onClick={nextMonth && this.handleClickNext}
                />
            </div>
            <CalendarMonth year={month.year()} month={month.month()} selected={selected}
                           minDate={this.props.minDate} maxDate={this.props.maxDate} onClick={this.handleClickDay}/>
        </div>;

    });

    return <span
        style={style} tabIndex={0} role='listbox' className={cn('', this.state.opened ? 'opened' : 'closed')}
        onKeyDown={this.handleDropDownInputKeyDown} onBlur={this.handleBlur}>

        <div style={styleCaption} className={cn('caption')} onClick={this.handleDropDownInputClick}>
            <Icon icon='calendar_normal' className={cn('caption-icon')}/>
            {moment(realValue[0]).format('MMM DD, YYYY') + ' - ' + moment(realValue[1]).format('MMM DD, YYYY')}
        </div>

        <DropDownContent
            style={styleDropDown} className={cn('dropdown')} zIndex={100} visible={this.state.opened}
            tabIndex={0} width={this.state.customMode ? (width - 1) * (this.props.monthsToShow + 1) + 1 : width}>
            {calendars}
            <div key='mainPanel' className={cn('panel')}>
                <div className={cn('dropdown-title')}>Preset Range</div>

                {_.map(this.adjustPresets(this.props.presets), (preset, index) => {
                    var classes = ['presets-option'];
                    if (fromDate.isSame(preset.fromDate, 'day') && toDate.isSame(preset.toDate, 'day')) {
                        classes.push('presets-option-selected')
                    }
                    return <div
                        key={index} className={cn(classes)}
                        onClick={this.handleClickPreset.bind(this, preset.fromDate.format(), preset.toDate.format())}>
                        {preset.label}
                    </div>;
                })}

                <div
                    className={cn('presets-option',
                    this.state.customMode ? 'presets-option-selected' : 'presets-option')}
                    onClick={this.handleClickCustom}>
                    <div className={cn('dropdown-title')}>Custom Range</div>
                    <div
                        className={cn('date', 'date-from',
                        this.state.customMode && this.state.customField === 'from' ? 'date-active' : 'date')}
                        onClick={this.handleClickFrom}>{fromDate.format('MMM DD, YYYY')}</div>
                    <div
                        className={cn('date', 'date-to',
                        this.state.customMode && this.state.customField === 'to' ? 'date-active' : 'date')}
                        onClick={this.handleClickTo}>{toDate.format('MMM DD, YYYY')}</div>
                </div>

                <div className={cn('button', 'button-save')} onClick={this.handleClickApply}>Apply</div>
                <div className={cn('button', 'button-cancel')} onClick={this.handleClickCancel}>Cancel</div>
            </div>

        </DropDownContent>
    </span>;
    /* jshint ignore:end */
};

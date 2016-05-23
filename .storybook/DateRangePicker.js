import React from 'react';
import moment from 'moment';
import { storiesOf, action } from '@kadira/storybook';
const DateRangePicker = require('../src/components/DateRangePicker');


storiesOf('DateRangePicker', module)
    .add('default', () => (
        <DateRangePicker
            value={[]}
            onChange={action('onChange')}
        />
    ))
    .add('aligned to right', () => (
        <DateRangePicker
            style={{float: 'right'}}
            align='right'
            value={[]}
            onChange={action('onChange')}
        />
    ))
    .add('use minimum and maximum allowed dates', () => (
        <DateRangePicker
            value={[moment(new Date()).subtract(5, 'days'), moment(new Date()).subtract(2, 'days')]}
            onChange={action('onChange')}
            maxDate={moment(new Date()).subtract(1, 'days')}
            minDate={moment(new Date()).subtract(15, 'days')}
        />
    ))
    .add('one month calendar', () => (
        <DateRangePicker
            value={[moment(new Date()).subtract(5, 'days'), moment(new Date()).subtract(2, 'days')]}
            onChange={action('onChange')}
            monthsToShow={1}
        />
    ))
    .add('three months calendar', () => (
        <DateRangePicker
            value={[moment(new Date()).subtract(5, 'days'), moment(new Date()).subtract(2, 'days')]}
            onChange={action('onChange')}
            monthsToShow={3}
        />
    ))
    .add('one month calendar without presets', () => (
        <DateRangePicker
            presets={[]}
            value={[moment(new Date()).subtract(5, 'days'), moment(new Date()).subtract(2, 'days')]}
            onChange={action('onChange')}
            monthsToShow={1}
        />
    ))
    .add('opened', () => (
        <DateRangePicker
            value={[]}
            opened={true}
            onChange={action('onChange')}
        />
    ))
    .add('at the end of the page', () => (
        <div style={{height:'75vh',display:'flex',flex:1,alignItems:'flex-end'}}>
            <DateRangePicker
                value={[]}
                onChange={action('onChange')}
            />
        </div>
    ))

;

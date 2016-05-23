import React from 'react';
import moment from 'moment';
import { storiesOf, action } from '@kadira/storybook';
const DatePicker = require('../src/components/DatePicker');


storiesOf('DatePicker', module)
    .add('default', () => (
        <DatePicker
            onChange={action('onChange')}
        />
    ))
    .add('aligned to right', () => (
        <div style={{float: 'right'}}>
            <DatePicker
                align='right'
                onChange={action('onChange')}
            />
        </div>
    ))
    .add('use minimum and maximum allowed dates', () => (
        <DatePicker
            onChange={action('onChange')}
            maxDate={moment(new Date()).add(15, 'days')}
            minDate={moment(new Date()).subtract(15, 'days')}
        />
    ))
    .add('two months', () => (
        <DatePicker
            onChange={action('onChange')}
            monthsToShow={2}
        />
    ))
    .add('at the end of the page', () => (
        <div style={{height:'75vh',display:'flex',flex:1,alignItems:'flex-end'}}>
            <DatePicker
                onChange={action('onChange')}
            />
        </div>
    ))
    .add('opened', () => (
        <DatePicker
            opened={true}
            onChange={action('onChange')}
        />
    ))
;

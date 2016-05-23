import React from 'react';
import moment from 'moment';
import { storiesOf, action } from '@kadira/storybook';
const DatePicker = require('../src/components/DatePicker');


storiesOf('DatePicker', module)
    .add('default', () => (
        <DatePicker
            opened={true}
            onChange={action('onChange')}
        />
    ))
    .add('aligned to right', () => (
        <div style={{float: 'right'}}>
            <DatePicker
                align='right'
                opened={true}
                onChange={action('onChange')}
            />
        </div>
    ))
    .add('use minimum and maximum allowed dates', () => (
        <DatePicker
            opened={true}
            onChange={action('onChange')}
            maxDate={moment(new Date()).add(15, 'days')}
            minDate={moment(new Date()).subtract(15, 'days')}
        />
    ))
    .add('two months', () => (
        <DatePicker
            opened={true}
            onChange={action('onChange')}
            monthsToShow={2}
        />
    ))
;

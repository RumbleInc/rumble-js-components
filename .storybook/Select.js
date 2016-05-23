import React from 'react';
import _ from 'lodash';
import { storiesOf, action } from '@kadira/storybook';
const Select = require('../src/components/Select');

const options1 = _.map(_.range(1, 51), i => ({
    label: i + ': value', value: 'value' + i
}));

storiesOf('Select', module)
    .add('default', () => (
        <Select
            options={options1}
            onChange={action('onChange')}
        />
    ))
    .add('with placeholder', () => (
        <Select
            placeholder='Placeholder'
            options={options1}
            onChange={action('onChange')}
        />
    ))
    .add('drop up', () => (
        <Select
            style={{marginTop:200}}
            direction='up'
            options={options1}
            onChange={action('onChange')}
        />
    ))
    .add('at the center of the page', () => (
        <Select
            style={{marginTop:'45vh'}}
            options={options1}
            onChange={action('onChange')}
        />
    ))
    .add('at the end of the page', () => (
        <Select
            style={{marginTop:'75vh'}}
            options={options1}
            onChange={action('onChange')}
        />
    ))
    .add('inline', () => (
        <Select
            options={options1}
            inline={true}
            onChange={action('onChange')}
        />
    ))
    .add('opened', () => (
        <Select
            options={options1}
            opened={true}
            onChange={action('onChange')}
        />
    ))
;

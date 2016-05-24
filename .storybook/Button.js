import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
const Button = require('../src/components/Button');


const buttonStyle = {
    margin: '1em'
};

const sizes = ['small', 'medium', 'large', 'default', 'medium-wide', 'large-wide'];
const types = ['save', 'cancel', 'send', 'input', 'add', 'menu', 'open', 'close', 'warning'];

storiesOf('Button', module)
    .add('default', () => (
        <Button
            caption='Button'
        />
    ))
    .add('title', () => (
        <Button
            caption='Button'
            title='This is a title'
        />
    ))
    .add('disabled', () => (
        <Button
            caption='Button'
            disabled
        />
    ))
    .add('width in pixels', () => (
        <Button
            caption='Button width 300px'
            width={300}
        />
    ))
    .add('width in percents', () => (
        <Button
            caption='Button width 25%'
            width='25%'
        />
    ))
    .add('primary icon', () => (
        <Button
            caption='Button'
            primaryIcon='trash_white'
        />
    ))
    .add('secondary icon', () => (
        <Button
            caption='Button'
            secondaryIcon='trash_white'
        />
    ))
    .add('two icons', () => (
        <Button
            caption='Button'
            primaryIcon='optimized_white'
            secondaryIcon='trash_white'
        />
    ))
    .add('sizes', () => (
        <div>
            {types.map(type => <div key={type}>
                <h2>{type}</h2>
                {sizes.map(size => <div key={size} style={{margin:'1em'}}>
                    <Button caption={size} size={size} type={type} />
                </div>)}
            </div>)}
        </div>
    ))
;

'use strict';

const { shallow, render } = require('enzyme');
const Input = require('../../src/components/Input');

describe('<Input />', () => {

    it('should be a component', () => {
        const wrapper = shallow(<Input />);
        expect(wrapper.find('.Input').length).toEqual(1);
    });

});

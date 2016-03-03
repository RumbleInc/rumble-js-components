'use strict';

const jss = require('jss');
jss.createStyleSheet = jest.genMockFunction().mockImplementation(() => {
    return {
        attach: () => {
        },
        detach: () => {
        },
        classes: {}
    };
});
jest.dontMock('../src/components/Input');
global['React'] = require('react');

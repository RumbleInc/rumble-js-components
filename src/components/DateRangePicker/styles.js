'use strict';

var styler = require('react-styler'),
    icons = require('../../icons');

var width = 300;
var height = 35;

styler.registerComponentStyles('DateRangePicker', {
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
        marginTop: -1,
        marginBottom: -1,
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
    },

    '&-presets-option': {
        padding: '5px 10px',
        backgroundColor: '#ffffff',
        color: '#464646',
        textAlign: 'left',
        cursor: 'pointer'
    },
    '&-presets-option:hover, &-presets-option-selected': {
        backgroundColor: '#ebeffb',
        color: '#4872ef'
    },
    '&-presets-option:hover &-dropdown-title, &-presets-option-selected:hover &-dropdown-title': {
        color: '#4872ef'
    },
    '&-presets-option &-dropdown-title': {
        padding: 0
    },
    '&-presets-option:last-of-type': {
        paddingBottom: 19
    },

    '&-date': {
        width: (width - 40) / 2,
        display: 'inline-block',
        marginRight: 10,
        marginTop: 30,
        padding: '0 10px',
        backgroundColor: '#ffffff',
        color: '#464646',
        boxSizing: 'border-box',
        border: '1px solid #dbdbdb',
        borderRadius: 1,
        height: 35,
        lineHeight: '35px',
        boxShadow: 'inset 0px 1px 1px 0px rgba(229, 229, 229, 0.5)',
        cursor: 'pointer'
    },
    '&-date:last-of-type': {
        marginRight: 0
    },
    '&-date-active': {
        borderColor: '#a4b8f7',
        color: '#4872ef'
    },

    '&-date:before': {
        width: (width - 40) / 2,
        color: '#464646',
        display: 'block',
        position: 'absolute',
        marginTop: -30,
        marginLeft: -11
    },

    '&-date-from:before': {
        content: '"From:"'
    },
    '&-date-to:before': {
        content: '"To:"'
    },

    '&-button': {
        height: 40,
        lineHeight: '40px',
        verticalAlign: 'middle',
        border: 'none',
        outline: 'none',
        borderRadius: 2,
        margin: '14px 20px 13px 0',
        float: 'right',
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 27,
        paddingRight: 27,
        cursor: 'pointer'
    },
    '&-button:active': {
        paddingTop: 2,
        paddingBottom: 0
    },
    '&-button-cancel': {
        color: '#747474',
        backgroundColor: '#ffffff'
    },
    '&-button-save': {
        boxShadow: '0px 1px 1px 0px rgba(219, 219, 219, 0.004)',
        color: '#ffffff',
        backgroundColor: '#4972f0'
    }

});

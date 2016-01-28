'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    moment = require('moment'),
    papa = require('papaparse'),
    Button = require('./Button'),
    styler = require('react-styler');

var ExportButton = React.createClass({

    displayName: 'ExportButton',

    propTypes: {
        caption: React.PropTypes.string,
        data: React.PropTypes.any,
        type: React.PropTypes.oneOf(['csv']),
        buttonType: React.PropTypes.string,
        filename: React.PropTypes.string
    },

    mixins: [styler.mixinFor('ExportButton')],

    /**
     * init
     */

    getDefaultProps: () => ({
        type: 'csv',
        buttonType: 'cancel'
    }),

    /**
     * helpers
     */

    exportToCsv(data, filename, link) {
        window.URL = window.webkitURL || window.URL;
        var bb = new Blob([papa.unparse(data)], {type: 'text/csv;charset=utf-8;'});
        link.download = filename;
        link.href = window.URL.createObjectURL(bb);
        link.dataset.downloadurl = ['text/csv;charset=utf-8;', link.download, link.href].join(':');
    },

    getFilename() {
        return (this.props.filename + '  Ts ' + moment().format('YYYYMMDDHHmm')).replace(/\s/g, '_') + '.' + this.props.type;
    },

    /**
     * handlers
     */

    handleClick() {
        this.exportToCsv(this.props.data, this.getFilename(), ReactDOM.findDOMNode(this));
    },

    /**
     * render
     */

    render() {
        /* jshint ignore:start */
        return <Button className={this.className()} caption={this.props.caption} type={this.props.buttonType}
            primaryIcon='download_excel' onClick={this.handleClick} title={this.props.title} tag='a' />;
        /* jshint ignore:end */
    }

});

module.exports = ExportButton;

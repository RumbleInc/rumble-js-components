'use strict';

// TODO: in the future we can use this: https://github.com/enyo/dropzone

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    styler = require('react-styler'),
    Icon = require('./Icon'),
    Button = require('./Button'),
    Input = require('./Input');

var FileUploader = React.createClass({

    displayName: 'FileUploader',

    propTypes: {
        allowClear: React.PropTypes.bool,
        allowDownload: React.PropTypes.bool,
        onClickClear: React.PropTypes.func,
        mode: React.PropTypes.oneOf(['object', 'array']),

        /**
         * value
         */
        value: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.shape({
                name: React.PropTypes.string,
                content: React.PropTypes.string
            })
        ]),

        /**
         * defaultValue
         */
        defaultValue: React.PropTypes.shape({
            name: React.PropTypes.string,
            content: React.PropTypes.string
        }),

        /**
         * callback function calls on changing value
         */
        onChange: React.PropTypes.func
    },

    mixins: [styler.mixinFor('FileUploader')],

    /**
     * init
     */

    getInitialState() {

        var value = _.isUndefined(this.props.value) ? this.props.defaultValue : this.props.value;
        if (_.isString(value)) {
            value = {
                name: value,
                content: ''
            };
        } else if (_.isArray(value) && value.length === 2) {
            value = {
                name: value[0],
                content: value[1]
            };
        }
        return {
            value: value || {}
        };
    },

    getDefaultProps: () => ({
        mode: 'object',
        allowDownload: false
    }),

    /**
     * helpers
     */

    setValue(value) {
        this.setState({value: value});
        this.props.onChange && this.props.onChange({
            target: {value: this.props.mode === 'array' ? [value.name, value.content] : value}
        });
    },

    /**
     * handlers
     */

    handleChange(event) {
        event.stopPropagation();
        var reader = new FileReader();
        var file = event.target.files[0];

        reader['onload'] = (upload) => {
            this.setValue({
                content: upload.target.result,
                size: file.size,
                name: file.name,
                type: file.type,
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                totalBytes: upload.total,
                loadedBytes: upload.loaded
            });
        };

        reader.readAsDataURL(file);
    },

    handleClear(event) {
        this.setValue({});
        this.props.onClickClear && this.props.onClickClear(event);
        ReactDOM.findDOMNode(this.refs['file']).value = '';
    },

    /**
     * lifecycle
     */

    componentWillReceiveProps(nextProps) {
        if (!_.isUndefined(nextProps.value)) {
            this.setState({
                value: nextProps.value
            });
        }
    },

    /**
     * render
     */

    render() {
        var cn = this.className;
        /* jshint ignore:start */
        return <div className={cn()}>
            <Input className={cn('caption')} value={this.state.value.name || ''} style={{width: '100%'}} readOnly={true}
                   tabIndex={-1}/>
            <span className={cn('upload')}>
                <Icon icon='upload'/>
                <input ref='file' type='file' title='Click to select file' onChange={this.handleChange}/>
            </span>
            {this.props.allowDownload && this.state.value.link && <span className={cn('download')}>
                <a target='_blank' href={this.state.value.link}> <Icon icon='download_normal'/></a>
            </span>}
            {this.props.allowClear &&
            <Icon className={cn('clear')} disabled={_.isEmpty(this.state.value.name)} icon='trash'
                  onClick={this.handleClear}/>}
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = FileUploader;

styler.registerComponentStyles('FileUploader', {
    display: 'inline-flex',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
    verticalAlign: 'middle',
    outline: 'none',
    boxSizing: 'border-box',
    minWidth: 360,

    '&-caption': {
        flexGrow: '2'
    },

    '&-upload': {
        width: 35,
        height: 35,
        overflow: 'hidden',
        cursor: 'pointer'
    },

    '&-upload .Icon': {
        position: 'absolute',
        width: 33,
        height: 35,
        backgroundPosition: 'right 10px center'
    },
    '&-upload input': {
        opacity: 0,
        width: 143,
        height: 'inherit',
        cursor: 'pointer',
        marginLeft: -100
    },

    '&-clear.Icon': {
        height: 35,
        backgroundPosition: 'right center'
    },
    '&-download': {
        width: 24,
        height: 16,
        overflow: 'hidden',
        cursor: 'pointer'
    },

    '&-download .Icon': {}

});

/**
 * ImageUploader
 *
 * @example
 * <ImageUploader hint='(2560×128px)' width={810} height={42} transparent={false} buttonsAlign='right' />
 */
'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    styler = require('react-styler'),
    _ = require('lodash'),
    Icon = require('./Icon');

module.exports = React.createClass({

    displayName: 'ImageUploader',

    mixins: [styler.mixinFor('ImageUploader')],

    propTypes: {
        /**
         * Width (in pixels)
         */
        width: React.PropTypes.number,

        /**
         * Height (in pixels)
         */
        height: React.PropTypes.number,

        /**
         * Preview (gray arey) width (in pixels)
         */
        previewWidth: React.PropTypes.number,

        /**
         * Preview (gray arey) height (in pixels)
         */
        previewHeight: React.PropTypes.number,

        /**
         * Preview style
         */
        previewStyle: React.PropTypes.object,

        /**
         * Shows transparency background on preview
         */
        transparent: React.PropTypes.bool,

        /**
         * Disabled or not
         */
        disabled: React.PropTypes.bool,

        /**
         * Filename (for download)
         */
        filename: React.PropTypes.string,

        /**
         * Hint (under the area)
         */
        hint: React.PropTypes.node,

        /**
         * String or another component for placeholder, can be empty
         */
        placeholder: React.PropTypes.node,

        /**
         * Show delete button?
         */
        deletable: React.PropTypes.bool,

        /**
         * Show download button?
         */
        downloadable: React.PropTypes.bool,

        /**
         * Buttons alignment (left or right)
         */
        buttonsAlign: React.PropTypes.oneOf(['left', 'right', 'right-middle']),

        /**
         * value
         */
        value: React.PropTypes.any,

        /**
         * defaultValue
         */
        defaultValue: React.PropTypes.any,

        /**
         * callback function calls on changing value
         */
        onChange: React.PropTypes.func,
        /**
         * extra style for loaded image size
         */
        imageStyle: React.PropTypes.any,
        /**
         * proportion for loaded image size
         */
        proportion: React.PropTypes.number
    },

    // init

    getDefaultProps() {
        return {
            deletable: true,
            downloadable: true,
            transparent: true,
            filename: 'image',
            buttonsAlign: 'left'
        };
    },

    getInitialState() {
        return {
            value: _.isUndefined(this.props.value) ? this.props.defaultValue : this.props.value
        };
    },

    // helpers

    setValue(value, isSilent) {
        this.setState({value});

        if (value && value !== '') {
            let loadedImage = new Image();
            loadedImage.onload = () => {
                let width = loadedImage.width;
                let height = loadedImage.height;
                !isSilent && this.props.onChange && this.props.onChange({target: {value, width, height}});
                this.setState({imageWidth: width, imageHeight: height});
            };
            loadedImage.src = value;
        } else {
            !isSilent && this.props.onChange && this.props.onChange({target: {value: value, width: 0, height: 0}});
        }

    },

    // handlers

    handleChange(e) {
        e.stopPropagation();
        var reader = new FileReader();
        var file = e.target.files[0];
        reader.onload = upload => {

            this.setValue(upload.target.result);
        };
        reader.readAsDataURL(file);
    },

    handleDownload() {
        var link = ReactDOM.findDOMNode(this.refs['download']);
        link.href = this.state.value;
        link.download = this.props.filename;
    },

    handleDelete() {
        this.index++;
        this.setValue('');
    },

    // lifecycle

    componentWillReceiveProps(nextProps) {
        let { value } = nextProps;
        if (!_.isUndefined(value)) {
            this.setValue(value, true);
        }
    },

    componentWillMount()
    {
        this.setValue(this.state.value, true);
    },

    // render

    render() {

        var cn = this.className;
        this.index = this.index || 0;

        let { width, height, previewWidth, previewHeight, previewStyle, disabled, buttonsAlign,
            placeholder, transparent, deletable, downloadable } = this.props;
        let { value } = this.state;

        var style = {
            width
        };

        var uploadStyle = {
            width,
            height
        };

        var fileStyle = {
            width: previewWidth || width,
            height: previewHeight || height
        };

        previewStyle = _.extend({
            width: previewWidth || width,
            height: previewHeight || height
        }, previewStyle || {});

        uploadStyle['paddingLeft'] = Math.floor((uploadStyle.width - previewStyle.width) / 2);
        uploadStyle['paddingTop'] = Math.floor((uploadStyle.height - previewStyle.height) / 2);

        var placeholderClassName = (previewStyle.width > 60 && previewStyle.height > 60) ?
            cn('placeholder-large') : cn('placeholder-small');

        var buttonsAlignment = 'buttons-left';

        if (buttonsAlign === 'right') {
            buttonsAlignment = 'buttons-right';
        } else if (buttonsAlign === 'right-middle') {
            buttonsAlignment = 'buttons-right-middle';
        }

        if (this.props.proportion) {
            var imageStyle = {
                width: this.state.imageWidth * this.props.proportion,
                height: this.state.imageHeight * this.props.proportion
            };
        }

        /* jshint ignore:start */
        return <div className={cn()} style={style}>
            <div className={cn('wrapper')}>
                <div className={cn('upload')} style={uploadStyle}>
                    <div className={cn('children')} style={previewStyle}>
                        {!disabled && <input
                            key={'area' + this.index}
                            type='file'
                            className={cn('file')}
                            style={fileStyle}
                            title='Click to select file'
                            onChange={this.handleChange}/>}
                        {!value && this.props.children}
                    </div>
                    <div className={cn('preview', transparent ? 'preview-transparent' : 'preview-grey')}
                         style={previewStyle}>
                        {value ?
                            <img src={value} style={this.props.imageStyle || imageStyle || {}}/> :
                            (placeholder ? placeholder : <div className={placeholderClassName}/>)}
                    </div>
                </div>
                <div
                    className={cn(
                        'buttons',
                        disabled ? 'buttons-disabled' : 'buttons-enabled',
                        buttonsAlignment
                    )}>
                    <span className={cn('button')}>
                        <Icon icon={disabled ? 'upload_disabled' : 'upload'}/>
                        {!disabled && <input
                            key={'button' + this.index}
                            type='file'
                            className={cn('file-small')}
                            title='Click to select file'
                            onChange={this.handleChange}/>}
                    </span>
                    {downloadable && value &&
                    <a className={cn('button')} href='#' ref='download' onClick={this.handleDownload}>
                        <Icon icon='download_normal'/>
                    </a>}
                    {deletable && value &&
                    <span className={cn('button','delete-button')} onClick={!disabled && this.handleDelete}>
                    <Icon icon={disabled ? 'trash_disabled' : 'trash'}/>
                </span>}
                </div>
                <div className={cn('hint')}>{this.props.hint}</div>
            </div>
        </div>;
        /* jshint ignore:end */

    }

});

styler.registerComponentStyles('ImageUploader', {

    '&-wrapper': {
        position: 'relative'
    },

    '&-upload': {
        boxSizing: 'border-box'
    },

    '&-preview': {
        outline: '1px solid #dbdbdb',
        textAlign: 'center',
        verticalAlign: 'middle',
        borderRadius: 1,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    '&-preview-transparent': {
        backgroundImage: 'url(' + require('url!../../images/ImageUploader/bw-squares.png') + ')'
    },
    '&-preview-grey': {
        background: '#f5f5f5'
    },

    '&-preview img': {
        maxWidth: '100%',
        maxHeight: '100%',
        verticalAlign: 'middle',
        position: 'relative',
        zIndex: '3'
    },

    '&-placeholder-large': {},

    '&-placeholder-small': {},

    '&-buttons': {
        paddingTop: 4,
        position: 'absolute',
        userSelect: 'none'
    },

    '&-buttons-left': {
        left: 0
    },
    '&-buttons-left &-button': {
        marginRight: 16
    },

    '&-buttons-right': {
        right: 0
    },
    '&-buttons-right-middle': {

        bottom: '0px',
        width: '60px',
        right: '-60px'

    },
    '&-buttons-right-middle &-button': {
        marginLeft: 4
    },
    '&-buttons-right &-button': {
        marginLeft: 16
    },

    '&-buttons-enabled &-button': {
        cursor: 'pointer'
    },

    '&-buttons .Icon': {
        position: 'absolute'
    },

    '&-button': {
        width: 14,
        height: 16,
        overflow: 'hidden',
        display: 'inline-block'
    },
    '&-delete-button': {
        height: '15px !important'
    },
    '&-hint': {
        color: '#c4c4c4',
        fontSize: 12,
        lineHeight: 24,
        fontStyle: 'italic',
        textAlign: 'center'
    },

    '&-file': {
        padding: 0,
        margin: 0,
        position: 'absolute',
        opacity: '0',
        cursor: 'pointer',
        left: 0,
        transform: 'scaleY(2)'
    },

    '&-file-small': {
        padding: 0,
        margin: 0,
        opacity: '0',
        cursor: 'pointer',
        transform: 'rotate(180deg)'
    },

    '&-children': {
        position: 'absolute',
        textAlign: 'center',
        overflow: 'hidden'
    },

    '&-children > &': {
        display: 'inline-block',
        lineHeight: '1.2em',
        verticalAlign: 'middle',
        textAlign: 'left'
    },

    '&-children > & &-preview': {
        border: '1px solid #999999',
        backgroundColor: 'transparent',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#dbdbdb'
    }
});

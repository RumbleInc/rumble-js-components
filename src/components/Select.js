'use strict';

var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler'),
    icons = require('../icons'),
    mixinDropDownInput = require('../mixins/mixinDropDownInput'),
    DropDownContent = require('./DropDownContent'),
    ScrollableContent = require('./ScrollableContent');

var Select = React.createClass({

    displayName: 'Select',

    propTypes: {
        options: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.any,
            hint: React.PropTypes.string,
            value: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
            disabled: React.PropTypes.bool,
            separator: React.PropTypes.bool,
            children: React.PropTypes.array
        })),
        disabled: React.PropTypes.bool,
        placeholder: React.PropTypes.string,
        multiple: React.PropTypes.bool,
        width: React.PropTypes.number,
        maxHeight: React.PropTypes.number,
        style: React.PropTypes.object,
        inline: React.PropTypes.bool
    },

    mixins: [
        styler.mixinFor('Select'),
        mixinDropDownInput
    ],

    /**
     * init
     */

    getDefaultProps: () => ({
        placeholder: 'Select',
        maxHeight: 400
    }),

    getInitialState: () => ({
        options: {},
        scrolledOption: 0
    }),

    /**
     * helpers
     */

    getSelectedOption(options) {
        options = options || this.props.options;
        var found = null;
        _.each(options, (option) => {
            if (!option.disabled && !option.separator && !_.isUndefined(option.value) &&
                option.value === this.state.value) {
                found = option;
            } else if (option.children) {
                found = found || this.getSelectedOption(option.children);
            }
        });
        return found;
    },

    getContentHeight() {
        var optionHeight = this.getStyleProp('&-option').height;
        return optionHeight * this.flattenValues().length;
    },

    isScrollEnabled() {
        return this.getContentHeight() > this.props.maxHeight;
    },

    flattenValues(options) {
        options = options || this.props.options;
        return _.reduce(options, (result, option) => {
            result.push(option.disabled ? undefined : option.value);
            if (option.children) {
                result = result.concat(this.flattenValues(option.children));
            }
            return result;
        }, []);
    },

    /**
     * handlers
     */

    handleKeyDown(event) {
        if (!event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey &&
            event.keyCode >= 33 && event.keyCode <= 40) {

            event.preventDefault();
            event.stopPropagation();
            var values = this.flattenValues();
            var keys = _.reduce(values, (result, key, index) => {
                if (!_.isUndefined(key)) {
                    result.push(index);
                }
                return result;
            }, []);
            var currentIndex = Math.max(0, keys.indexOf(values.indexOf(
                _.isUndefined(this.state.hoveredValue) ?
                    this.state.value :
                    this.state.hoveredValue
            )));
            var newIndex;

            var optionHeight = this.getStyleProp('&-option').height;
            var scrollingEnabled = this.isScrollEnabled();
            var optionsPerPage = this.props.maxHeight / optionHeight;
            var scrolledOption;
            var delta = Math.floor(optionsPerPage);

            if (event.keyCode === 36) { // home
                newIndex = 0;

            } else if (event.keyCode === 35) { // end
                newIndex = keys.length - 1;

            } else if (event.keyCode === 33) { // page up
                if (currentIndex !== -1) {
                    newIndex = Math.max(0, currentIndex - delta);
                }

            } else if (event.keyCode === 34) { // page down
                if (currentIndex !== -1) {
                    newIndex = Math.min(keys.length - 1, currentIndex + delta);
                }

            } else if (event.keyCode === 37 || event.keyCode === 38) { // prev
                if (currentIndex > 0) {
                    newIndex = currentIndex - 1;
                }

            } else if (event.keyCode === 39 || event.keyCode === 40) { // next
                if (currentIndex !== -1 && currentIndex < keys.length - 1) {
                    newIndex = currentIndex + 1;
                }

            }

            if (!_.isUndefined(newIndex)) {
                newIndex = keys[newIndex];
                var newValue = values[newIndex];

                if (newIndex < this.state.scrolledOption) {
                    scrolledOption = newIndex;
                } else if (newIndex > (this.state.scrolledOption + optionsPerPage - 1)) {
                    scrolledOption = newIndex - optionsPerPage + 1;
                }

                if (this.state.opened) {
                    var state = {
                        hoveredValue: newValue
                    };

                    if (scrollingEnabled && !_.isUndefined(scrolledOption)) {
                        state.scrolledOption = Math.max(scrolledOption, 0);
                    }
                    this.setState(state);
                } else {
                    if (this.props.inline && scrollingEnabled && !_.isUndefined(scrolledOption)) {
                        this.setState({
                            scrolledOption: Math.max(scrolledOption, 0)
                        });
                    }
                    this.setValue(newValue);
                }
            }
            if (!this.props.inline) {
                return true;
            }
        }
    },

    handleHoverOption(value) {
        this.setState({
            hoveredValue: value
        });
    },

    handleClickOption(option, event) {
        if (_.isUndefined(option.value) || option.disabled) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            this.setValue(option.value);
        }
    },

    handleInlineBlur() {
        this.setState({
            hoveredValue: undefined
        });
    },

    /**
     * render
     */

    renderOptions(options) {
        options = options || this.props.options;

        var cn = this.className;
        var checkValue = _.isUndefined(this.state.hoveredValue) ? this.state.value : this.state.hoveredValue;

        /* jshint ignore:start */
        return _.map(options, (option, index) => {
            var className = 'option',
                hasValue = !_.isUndefined(option.value);

            if (option.separator) {
                return <div key={index} className={cn('separator')}></div>;
            }

            if (!option.disabled && hasValue && checkValue === option.value) {
                className = 'option-active';
            }
            if (option.children) {

                return <div key={index} className={cn('option-group')}>
                    <div
                        className={cn('option-group-title', className,
                            option.disabled ? 'option-disabled' : 'option-enabled')}
                        onMouseOver={!option.disabled && hasValue && this.handleHoverOption.bind(this, option.value)}
                        onClick={this.handleClickOption.bind(this, option)}>
                        {option.label}
                        {option.hint && <span className={cn('option-hint')}>{option.hint}</span>}
                    </div>
                    <div className={cn('option-children')}>
                        {this.renderOptions(option.children)}
                    </div>
                </div>;

            } else {

                return <div
                    key={index}
                    className={cn(className, option.disabled ? 'option-disabled' : 'option-enabled')}
                    onMouseOver={!this.props.inline && !option.disabled && hasValue &&
                        this.handleHoverOption.bind(this, option.value)}
                    onClick={this.handleClickOption.bind(this, option)}>
                    {option.label}
                    {option.hint && <span className={cn('option-hint')}>{option.hint}</span>}
                </div>;

            }
        });
        /* jshint ignore:end */
    },

    render() {

        var cn = this.className;

        var width = this.props.width || this.getStyleProp()['width'];
        var style = _.extend({
            width: width
        }, this.props.style);

        var optionHeight = this.getStyleProp('&-option').height;

        var selectedOption = this.getSelectedOption();
        var options = this.renderOptions();

        /* jshint ignore:start */
        var caption = selectedOption ?
            <span>
                {selectedOption.label}
                {selectedOption.hint && <span className={cn('option-hint')}>{selectedOption.hint}</span>}
            </span> :
            <span className={cn('placeholder')}>{this.props.placeholder}</span>;

        var scrollingEnabled = this.isScrollEnabled();
        if (scrollingEnabled) {
            options = <ScrollableContent
                width={this.props.inline ? width : width - 2}
                scrollY={-optionHeight * this.state.scrolledOption}>
                {options}
            </ScrollableContent>;
        }

        if (this.props.inline) {
            return <span style={style} tabIndex={this.props.disabled ? undefined : 0} role='listbox'
                         className={cn('', 'inline',
                    this.props.disabled ? 'disabled' : 'enabled'
                )}
                         onKeyDown={!this.props.disabled && this.handleKeyDown}
                         onBlur={!this.props.disabled && this.handleInlineBlur}>
                <div style={{width: width, height: this.props.maxHeight}}>
                    {options}
                </div>
            </span>;

        } else {
            return <span
                style={style} tabIndex={this.props.disabled ? undefined : 0} role='listbox'
                className={cn('',
                    this.state.opened ? 'opened' : 'closed',
                    this.props.disabled ? 'disabled' : 'enabled'
                )}
                onKeyDown={!this.props.disabled && this.handleDropDownInputKeyDown.bind(this, this.handleKeyDown)}
                onClick={!this.props.disabled && this.handleDropDownInputClick}
                onBlur={!this.props.disabled && this.handleDropDownInputBlur}>

                <div className={cn('caption')}>{caption}</div>

                <DropDownContent
                    className={cn('dropdown')} zIndex={100} visible={this.state.opened} tabIndex={null}
                    width={width} height={scrollingEnabled ? this.props.maxHeight + 10 : undefined}>
                    {options}
                </DropDownContent>

            </span>;
        }
        /* jshint ignore:end */
    }

});

module.exports = Select;

var width = 225;
var height = 35;

styler.registerComponentStyles('Select', {
    display: 'inline-block',
    width: width,
    lineHeight: height + 'px',
    outline: 'none',
    fontFamily: 'GothamBook, "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: '#999999',
    verticalAlign: 'baseline',
    userSelect: 'none',
    cursor: 'default',
    position: 'relative',

    '&-opened, &-closed': {
        height: height
    },

    '&-opened &-caption': {
        backgroundColor: 'rgb(245, 245, 245)'
    },

    '&-caption': {
        width: 'inherit',
        height: height,
        padding: '0 8px',
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
    '&-placeholder': {
        color: '#989898',
        fontStyle: 'italic'
    },
    '&-disabled, &-disabled &-placeholder': {
        color: '#c7ccf6',
        cursor: 'default'
    },

    '& > &-dropdown': {
        left: 0,
        top: height - 1,
        backgroundColor: '#ffffff',
        padding: '4px 0 6px 0',
        boxSizing: 'border-box',
        fontSize: 15,
        lineHeight: '30px'
    },
    '&-option': {
        width: 'inherit',
        height: 30,
        padding: '0 8px',
        backgroundColor: '#ffffff',
        color: '#464646',
        boxSizing: 'border-box'
    },
    '&-separator': {
        borderTop: '1px solid rgba(219, 219, 219, 1)',
        width: 'inherit',
        margin: '8px 0',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box'
    },

    '&-inline &-option-enabled': {
        cursor: 'pointer'
    },
    '&-option-active': {
        width: 'inherit',
        height: 30,
        padding: '0 8px',
        backgroundColor: '#ebeffb',
        color: '#4872ef',
        boxSizing: 'border-box'
    },
    '&-option-children > &-option, &-option-children > &-option-active': {
        paddingLeft: 18
    },
    '&-option-group-title': {
        textTransform: 'uppercase',
        color: '#c2c2c2'
    },
    '&-option-disabled': {
        color: '#c2c2c2',
        fontStyle: 'italic',
        cursor: 'auto'
    },

    '&-option-hint': {
        marginLeft: '0.25em',
        color: '#c0c0c0',
        fontStyle: 'italic'
    }

});

'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    styler = require('react-styler'),
    icons = require('../icons'),
    getTextWidth = require('../helpers/getTextWidth'),
    mixinDropDownInput = require('../mixins/mixinDropDownInput'),
    DropDownContent = require('./DropDownContent'),
    ScrollableContent = require('./ScrollableContent'),
    Icon = require('./Icon'),
    Input = require('./Input'),
    CheckBox = require('./CheckBox');

var MultiSelect = React.createClass({

    displayName: 'MultiSelect',

    propTypes: {
        options: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.any.isRequired,
            value: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
            selectedLabel: React.PropTypes.any,
            disabled: React.PropTypes.bool
        })),
        pinnedValues: React.PropTypes.array,
        placeholder: React.PropTypes.string,
        title: React.PropTypes.string,
        alternativeOptions: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.any.isRequired,
            value: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
            disabled: React.PropTypes.bool
        })),
        alternativeTitle: React.PropTypes.string,
        filterable: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        inline: React.PropTypes.bool,
        captionsLimit: React.PropTypes.number,
        allCaptionsLimit: React.PropTypes.number,
        allTitle: React.PropTypes.string,
        allowSelectAll: React.PropTypes.bool,
        inverseSelectAll: React.PropTypes.bool,
        closeAfterSelect: React.PropTypes.bool,
        width: React.PropTypes.number,
        maxWidth: React.PropTypes.number,
        maxHeight: React.PropTypes.number,
        style: React.PropTypes.object,
        moreCaption: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
        titleHeight: React.PropTypes.number,
        allHeight: React.PropTypes.number,
        filterHeight: React.PropTypes.number,
        valuesLimit: React.PropTypes.number,
        direction: React.PropTypes.oneOf(['up', 'down', 'smart'])
    },

    mixins: [
        styler.mixinFor('MultiSelect'),
        mixinDropDownInput
    ],

    /**
     * init
     */

    getDefaultProps: () => ({
        placeholder: 'Select',
        pinnedValues: [],
        maxHeight: 330,
        captionsLimit: 3,
        allCaptionsLimit: 20,
        closeAfterSelect: true,
        allTitle: 'All',
        moreCaption: ['+ one more option', '+ {n} more options'],
        direction: 'smart'
    }),

    getInitialState: () => ({
        filter: '',
        options: {},
        scrolledOption: 0
    }),

    isAlternativeListMode() {
        return !this.state.filter && !_.isEmpty(this.props.alternativeOptions);
    },

    /**
     * helpers
     */

    updateValue(value) {
        if (_.isArray(this.props.pinnedValues) && this.props.pinnedValues.indexOf(value) !== -1) {
            return;
        }
        var state = {};
        var allValue = _.clone(this.state.value || []);
        var valueIndex = allValue.indexOf(value);
        if (valueIndex !== -1) {
            allValue.splice(valueIndex, 1);
        } else if (!_.isUndefined(value)) {
            if (!this.props.valuesLimit || allValue.length < this.props.valuesLimit) {
                allValue.push(value);
                if (!this.props.inline && this.props.closeAfterSelect) {
                    state.opened = false;
                    state.filter = '';
                }
            }
        }

        if (!_.isEqual(allValue, this.state.value)) {
            this.props.onChange && this.props.onChange({target: {value: allValue}});
            state.value = allValue;
            if (_.size(allValue) <= this.props.captionsLimit) {
                state['expanded'] = false;
            }

            this.setState(state);
        }
    },

    getOptions(filter) {
        var isArrayMode = _.isArray(this.props.options);
        filter = filter || (this.state.filter || '').toLowerCase();
        return filter ? _.filter(this.props.options, (obj, index) => {

            var label = isArrayMode ? obj.label : obj;
            var value = isArrayMode ? obj.value : index;
            if (_.isNumber(value)) {
                value = value.toString();
            }
            return _.isString(label) && (
                    !filter ||
                    (filter === '=' && (this.state.value.indexOf(value) !== -1)) ||
                    label.toLowerCase().indexOf(filter) !== -1
                ) ||
                (_.isString(value) && value.indexOf(filter) !== -1);

        }) : (this.props.alternativeOptions || this.props.options);
    },

    getFont() {
        if (!this._font) {
            var fontSize = this.getStyleProp('caption')['fontSize'];
            if (_.isNumber(fontSize)) {
                fontSize += 'px';
            }
            this._font = fontSize + ' ' + this.getStyleProp()['fontFamily'];
        }
        return this._font;
    },

    getHoveredIndex() {
        var options = this.getOptions(),
            keys = _.pluck(options, 'value');

        return Math.max(0, keys.indexOf(
            _.isUndefined(this.state.hoveredValue) ?
                _.last(this.state.value) :
                this.state.hoveredValue
        ));
    },

    getMoreCaption(number) {
        var str = '';
        if (_.isString(this.props.moreCaption)) {
            str = this.props.moreCaption;
        } else if (_.isArray(this.props.moreCaption) && this.props.moreCaption.length > 1) {
            if (number === 1) {
                str = this.props.moreCaption[0];
            } else {
                str = this.props.moreCaption[1];
            }
        }
        return str.replace('{n}', number);
    },

    /**
     * handlers
     */

    handleKeyDown(event) {
        if (!event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {

            var options, keys;
            var keyCodes = this.props.filterable ?
                [33, 34, 35, 36, 38, 40] :
                [33, 34, 35, 36, 37, 38, 39, 40];

            if ((this.state.opened || this.props.inline) && keyCodes.indexOf(event.keyCode) !== -1) {

                event.preventDefault();
                event.stopPropagation();
                options = this.getOptions();
                keys = _.pluck(options, 'value');
                var currentIndex = this.getHoveredIndex();
                var newIndex;

                var optionHeight = this.getStyleProp('&-option').height;
                var scrollingEnabled = optionHeight * _.size(options) > this.props.maxHeight;
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

                if (newIndex < this.state.scrolledOption) {
                    scrolledOption = newIndex;
                } else if (newIndex > (this.state.scrolledOption + optionsPerPage - 1)) {
                    scrolledOption = newIndex - optionsPerPage + 1;
                }

                if (!_.isUndefined(newIndex)) {
                    var state = {
                        hoveredValue: keys[newIndex]
                    };
                    if (scrollingEnabled && !_.isUndefined(scrolledOption)) {
                        state.scrolledOption = Math.max(scrolledOption, 0);
                    }
                    this.setState(state);
                }
                if (!this.props.inline) {
                    return true;
                }

            } else if ((this.state.opened || this.props.inline) && event.keyCode === 13) {

                event.preventDefault();
                event.stopPropagation();

                options = this.getOptions();
                keys = _.pluck(options, 'value');
                this.updateValue(_.isUndefined(this.state.hoveredValue) ?
                    keys[this.getHoveredIndex()] :
                    this.state.hoveredValue);

                if (!this.props.inline) {
                    return true;
                }

            } else if ((this.state.opened || this.props.inline) && !this.props.filterable && event.keyCode === 32) {

                event.preventDefault();
                event.stopPropagation();
                options = this.getOptions();
                keys = _.pluck(options, 'value');
                this.updateValue(_.isUndefined(this.state.hoveredValue) ?
                    keys[this.getHoveredIndex()] : this.state.hoveredValue
                );

                if (!this.props.inline) {
                    return true;
                }

            } else if (!this.props.inline && this.props.filterable && event.keyCode === 8 && !this.state.filter) {

                event.preventDefault();
                event.stopPropagation();
                this.updateValue(_.last(this.state.value));
                if (!this.props.inline) {
                    return true;
                }

            } else if ((this.state.opened || this.props.inline) && event.keyCode === 27 && this.state.filter) {

                event.preventDefault();
                event.stopPropagation();
                this.setState({
                    hoveredValue: undefined,
                    filter: ''
                });
                if (!this.props.inline) {
                    return true;
                }

            } else if (!this.state.opened && !this.props.inline && event.keyCode === 40) { // down

                event.preventDefault();
                event.stopPropagation();
                this.setState({opened: true});
                if (!this.props.inline) {
                    return true;
                }

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
            this.updateValue(option.value);
            this.setState({
                hoveredValue: option.value
            });
        }
    },

    handleClickRemoveValue(value, event) {
        event.stopPropagation();
        this.updateValue(value);
    },

    handleChangeFilter(event) {
        this.setState({
            hoveredValue: undefined,
            filter: event.target.value,
            opened: true
        });
    },

    handleFocusWithFilter() {
        this.refs['filter'] && ReactDOM.findDOMNode(this.refs['filter']).querySelector('.Input-input').focus();
    },

    handleBlur() {
        _.delay(() => {
            var input = this.refs['filter'] && ReactDOM.findDOMNode(this.refs['filter']).querySelector('.Input-input');
            var selectAll = this.refs['selectAll'] && ReactDOM.findDOMNode(this.refs['selectAll']);
            if ((!input && !selectAll) ||
                (input !== document.activeElement && selectAll !== document.activeElement &&
                ReactDOM.findDOMNode(this) !== document.activeElement) || !this.props.filterable) {
                this.handleDropDownInputBlur();
            }
        }, 10);
    },

    handleClickMore(event) {
        event.stopPropagation();
        this.setState({expanded: true, opened: false});
    },

    handleHideExpanded() {
        this.setState({expanded: false});
    },

    handleClickExpander(event) {
        event.stopPropagation();
    },

    handleChangeSelectAll(event) {
        var selectAll = this.props.inverseSelectAll ? !event.target.value : event.target.value;
        if (selectAll && !this.props.inverseSelectAll) {
            this.setValue(_.pluck(this.props.options, 'value'));
        } else {
            this.setValue([]);
        }

        if (!this.props.inline && this.props.closeAfterSelect) {
            this.setState({
                opened: false,
                filter: ''
            });
        }
    },

    /**
     * lifecycle
     */

    componentDidUpdate() {
        if ((this.state.opened || this.props.inline) && this.props.filterable && this.refs['filter']) {
            ReactDOM.findDOMNode(this.refs['filter']).querySelector('.Input-input').focus();
        }
    },

    /**
     * render
     */

    renderCaption(captions, maxValues) {
        var cn = this.className;

        /* jshint ignore:start */
        var result = _.map(this.props.pinnedValues || [], (value, index) => (
            <span key={'p' + index} className={cn('value', 'value-readonly')}>
                <span>{captions[value] || value}</span>
            </span>
        ));

        return result.concat(_.reduce(this.state.value, (result, value, index) => {

            if (this.props.pinnedValues && this.props.pinnedValues.indexOf &&
                this.props.pinnedValues.indexOf(value) !== -1) {
                return result;
            }

            if (!maxValues || (result.length < maxValues)) {

                result.push(<span key={index} className={cn('value')}>
                    <span>{captions[value]}</span>
                    <Icon icon='remove_label' className={cn('value-remove')}
                          onClick={this.handleClickRemoveValue.bind(this, value)}/>
                </span>);

            } else if (result.length === maxValues) {

                var number = _.size(this.state.value) - maxValues;
                result.push(<span key={index} className={cn('more')}>
                    <span onClick={this.handleClickMore}>{this.getMoreCaption(number)}</span>
                </span>);

            }
            return result;

        }, []));
        /* jshint ignore:end */
    },

    render() {

        var cn = this.className;

        var width = this.props.width || this.getStyleProp()['width'];

        var allSelected = true;
        var options = this.getOptions();
        var optionHeight = this.getStyleProp('&-option').height;

        var captions = _.reduce(this.props.options, (result, obj) => {
            if (!_.isUndefined(obj.value)) {
                result[obj.value] = obj.selectedLabel || obj.label;
                if (this.props.inverseSelectAll) {
                    allSelected = allSelected &&
                        (!_.isArray(this.state.value) || this.state.value.indexOf(obj.value) === -1);
                } else {
                    allSelected = allSelected &&
                        _.isArray(this.state.value) && this.state.value.indexOf(obj.value) !== -1;
                }
            }
            return result;
        }, {});

        if (this.props.maxWidth && _.isNumber(this.props.maxWidth) && this.props.maxWidth > width) {
            width = Math.min(
                this.props.maxWidth,
                Math.max(
                    width,
                    _.reduce(this.state.value, (result, value) => {
                        if (captions[value] && result < this.props.maxWidth) {
                            result = result + getTextWidth(captions[value], this.getFont()) + 45;
                        }
                        return result;
                    }, 20 + (this.props.filterable ? 20 : 0))
                )
            );
        }

        var i = 0;
        var hoveredIndex = this.getHoveredIndex();

        /* jshint ignore:start */
        var list = _.map(options, (option, index) => {
            var classes = ['option'];
            var pinned = false;
            var hasValue = !_.isUndefined(option.value);

            if (!option.disabled) {
                classes.push('option-enabled');
                if (this.state.value && this.state.value.indexOf && this.state.value.indexOf(option.value) !== -1) {
                    classes.push('option-active');
                }
                if (!_.isEmpty(this.props.pinnedValues) &&
                    this.props.pinnedValues.indexOf && this.props.pinnedValues.indexOf(option.value) !== -1) {
                    classes.push('option-active');
                    pinned = true;
                }
            } else {
                classes.push('option-disabled')
            }

            if (index === hoveredIndex) {
                classes.push('option-hovered');
            }
            i++;
            return <div key={index}
                        className={cn(classes)}
                        onMouseOver={(
                            !option.disabled && hasValue && !this.props.inline &&
                            this.handleHoverOption.bind(this, option.value)
                        )}
                        onClick={!pinned && this.handleClickOption.bind(this, option)}>{option.label}</div>;
        });

        var titleItemHeight = this.props.titleHeight || this.getStyleProp('&-title').height;
        var allItemHeight = this.props.allHeight || this.getStyleProp('&-all').height;
        var filterItemHeight = this.props.filterHeight || this.getStyleProp('&-filter').height;

        var scrollHeight, scrollingEnabled, dropdownHeight;
        if (this.props.inline) {
            dropdownHeight = this.props.maxHeight;
            scrollHeight = dropdownHeight -
                (this.props.title ? titleItemHeight : 0) -
                (this.props.allowSelectAll ? Math.max(allItemHeight, filterItemHeight) : (
                    !this.props.disabled && this.props.filterable ? filterItemHeight : 0
                ));
            scrollingEnabled = optionHeight * i > scrollHeight;
        } else {
            scrollHeight = this.props.maxHeight;
            scrollingEnabled = optionHeight * i > scrollHeight;
            dropdownHeight = scrollingEnabled ?
                (scrollHeight + 10 +
                (this.props.title ? titleItemHeight : 0) +
                (this.props.allowSelectAll ? allItemHeight : 0)) :
                undefined;
        }

        if (scrollingEnabled) {
            list = <ScrollableContent width={this.props.inline ? width : width - 2} height={scrollHeight}
                                      scrollY={-optionHeight * this.state.scrolledOption}>
                {list}
            </ScrollableContent>;
        }

        var style = _.extend({
            width: width
        }, this.props.style);

        var styleFilter;
        if (this.props.filterable) {
            var flexBasis = getTextWidth(this.state.filter, this.getFont());
            styleFilter = {
                flexBasis: flexBasis,
                WebkitBoxBasis: flexBasis,
                WebkitFlexBasis: flexBasis,
                msFlexBasis: flexBasis
            };
        }

        if (this.props.inline) {

            return <div style={style} tabIndex={this.props.disabled ? undefined : 0} role='listbox'
                        className={cn('', 'inline',
                    this.props.filterable ? 'filterable' : 'not-filterable',
                    this.props.disabled ? 'disabled' : 'enabled'
                )}
                        onKeyDown={!this.props.disabled && this.handleKeyDown}
                        onFocus={!this.props.disabled && this.props.filterable && this.handleFocusWithFilter}>

                <div style={{width: width, height: dropdownHeight}}>
                    {this.props.allowSelectAll ? <label className={cn('all')}>
                        <CheckBox ref='selectAll' value={allSelected} onChange={this.handleChangeSelectAll}/>
                        <span>{this.props.allTitle}</span>
                        {!this.props.disabled && this.props.filterable &&
                        <div className={cn('filter')} style={styleFilter}>
                            <Input type='text' ref='filter' placeholder={this.props.placeholder}
                                   value={this.state.filter} onChange={this.handleChangeFilter}
                                   allowClear={true} style={{width: '100%'}}/>
                        </div>}
                    </label> : (!this.props.disabled && this.props.filterable &&
                    <div className={cn('filter')} style={styleFilter}>
                        <Input type='text' ref='filter' placeholder={this.props.placeholder}
                               value={this.state.filter} onChange={this.handleChangeFilter}
                               allowClear={true} style={{width: '100%'}}/>
                    </div>)}
                    {!this.state.filter && this.props.alternativeTitle ?
                        <div className={cn('title', 'alter-title')}>{this.props.alternativeTitle}</div> :
                        (this.props.title && <div className={cn('title')}>{this.props.title}</div>)}
                    {list}
                </div>

            </div>;

        } else {

            return <div style={style} tabIndex={this.props.disabled ? undefined : 0} role='listbox'
                        className={cn('',
                    this.state.opened ? 'opened' : 'closed',
                    this.props.filterable ? 'filterable' : 'not-filterable',
                    this.props.disabled ? 'disabled' : 'enabled'
                )}
                        onKeyDown={!this.props.disabled && !this.state.expanded &&
                        this.handleDropDownInputKeyDown.bind(this, this.handleKeyDown)}
                        onFocus={!this.props.disabled && this.props.filterable && this.handleFocusWithFilter}
                        onBlur={!this.props.disabled && this.state.opened && this.handleBlur}>

                <div className={cn('caption')}
                     onClick={!this.props.disabled && this.handleDropDownInputClick}>
                    {this.state.expanded &&
                    <DropDownContent
                        className={cn('expander', 'caption')} zIndex={110} width={width} visible={true}
                        direction={this.props.direction}
                        onHide={this.handleHideExpanded} onClick={this.handleClickExpander}>
                        {this.renderCaption(captions, this.props.allCaptionsLimit)}
                    </DropDownContent>}
                    {(!_.isEmpty(this.state.value) || !_.isEmpty(this.props.pinnedValues)) &&
                    this.renderCaption(captions, this.props.captionsLimit)}
                    {!this.props.disabled && !this.state.expanded && this.props.filterable ?
                        <div className={cn('filter')} style={styleFilter}>
                            <Input type='text' ref='filter'
                                   placeholder={_.isEmpty(this.state.value) ? this.props.placeholder : undefined}
                                   value={this.state.filter} onChange={this.handleChangeFilter}
                                   allowClear={true} style={{width: '100%'}}/>
                        </div> :
                        (_.isEmpty(this.state.value) && _.isEmpty(this.props.pinnedValues) &&
                        <span className={cn('placeholder')}>{this.props.placeholder}</span>)}
                </div>

                {!this.props.disabled && <DropDownContent
                    className={cn('dropdown')} zIndex={100} direction={this.props.direction}
                    visible={!this.state.expanded && this.state.opened}
                    width={width} height={dropdownHeight}>
                    {this.props.title && <div className={cn('title')}>{this.props.title}</div>}
                    {this.props.allowSelectAll && <label className={cn('all')}>
                        <CheckBox ref='selectAll' value={allSelected} onChange={this.handleChangeSelectAll}/>
                        <span>{this.props.allTitle}</span>
                    </label>}
                    {list}
                </DropDownContent>}

            </div>;

        }
        /* jshint ignore:end */
    }

});

module.exports = MultiSelect;

var width = 225;
var height = 35;

var inputPlaceholder = {
    fontStyle: 'italic',
    color: '#7495f2'
};

styler.registerComponentStyles('MultiSelect', {
    display: 'inline-block',
    width: width,
    lineHeight: height + 'px',
    outline: 'none',
    fontFamily: 'GothamBook, "Helvetica Neue", Helvetica, Arial, sans-serif',
    verticalAlign: 'baseline',
    userSelect: 'none',
    cursor: 'default',
    position: 'relative',
    color: '#999999',
    minHeight: height,

    '&-disabled, &-disabled &-placeholder': {
        color: '#c7ccf6',
        cursor: 'default'
    },

    '&-enabled:focus &-caption, &-opened &-caption': {
        border: '1px solid #a3b8f7',
        backgroundColor: '#d1dcfc'
    },
    '&-caption': {
        width: 'inherit',
        minHeight: height,
        lineHeight: '24px',
        padding: '4px 8px 0',
        boxSizing: 'border-box',
        fontSize: 15,
        borderTop: '1px solid transparent',
        borderRight: '1px solid transparent',
        borderBottom: '1px solid #4972f0',
        borderLeft: '1px solid transparent',
        backgroundColor: '#ebeffb',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        alignContent: 'space-between'
    },

    '&-filterable&-enabled &-caption': {
        cursor: 'text'
    },

    '&-placeholder': inputPlaceholder,

    '&-value': {
        display: 'inline-flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
        height: 24,
        lineHeight: '21px',
        padding: '0 0 0 8px',
        color: '#4672ed',
        backgroundColor: '#ffffff',
        marginRight: 6,
        marginBottom: 5,
        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
        cursor: 'default'
    },
    '&-value:hover': {
        backgroundColor: '#f5f5f5'
    },
    '&-value-readonly': {
        padding: '0 8px',
        color: '#c4c4c4'
    },
    '&-value-readonly:hover': {
        backgroundColor: '#ffffff'
    },
    '&-value-remove': {
        marginLeft: 4,
        padding: '6px 8px',
        flex: 1
    },

    '&-more': {
        color: '#4672ed',
        textAlign: 'right',
        flexGrow: '2',
        whiteSpace: 'nowrap',
        order: '10000'
    },
    '&-more span': {
        cursor: 'pointer'
    },

    '& > &-dropdown': {
        left: 0,
        marginTop: -1,
        borderTop: '1px solid #4972f0',
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
        boxSizing: 'border-box',
        whiteSpace: 'nowrap'
    },
    '&-option:before': {
        content: '""',
        display: 'inline-block',
        width: 30,
        height: 9
    },
    '&-option-active': {
        height: 30,
        padding: '0 8px',
        color: '#4872ef'
    },
    '&-option-active:before': {
        backgroundImage: 'url("' + icons.v_blue + '")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '5px center'
    },
    '&-option-hovered': {
        backgroundColor: '#ebeffb',
        color: '#4872ef'
    },

    '&-filter': {
        flexGrow: '100',
        flexBasis: '1px',
        minWidth: 10,
        height: height
    },

    '&-filter .Input-input': {
        color: '#4672ed',
        padding: 0,
        lineHeight: '24px',
        height: 24,
        marginBottom: 5,
        backgroundColor: 'transparent'
    },

    '&-filter .Input-input, &-filter .Input-input:focus': {
        border: 'none'
    },

    '&-filter .Input-input::-webkit-input-placeholder': inputPlaceholder,
    '&-filter .Input-input::-moz-placeholder': inputPlaceholder,
    '&-filter .Input-input:-moz-placeholder': inputPlaceholder,
    '&-filter .Input-input:-ms-input-placeholder': inputPlaceholder,

    '&-filter .Input-clear-icon': {
        display: 'none'
    },

    '&-inline &-all': {
        display: 'flex',
        alignItems: 'center'
    },

    '&-inline &-all span:nth-of-type(2)': {
        flexGrow: '100'
    },

    '&-inline &-all &-filter': {
        height: 25,
        lineHeight: '1'
    },

    '&-caption&-expander': {
        backgroundColor: '#ffffff !important',
        border: '1px solid rgba(219, 219, 219, 1)',
        marginLeft: -9,
        marginTop: -5,
        cursor: 'default'
    },

    '&-caption&-expander .DropDownContent-content': {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        alignContent: 'space-between'
    },

    '&-all': {
        color: '#464646',
        height: 38,
        display: 'block'
    },
    '&-all .CheckBox': {
        marginLeft: 10,
        marginRight: 28
    },

    '&-title': {
        color: '#999999',
        fontStyle: 'italic',
        height: 30,
        padding: '0 9px'
    },

    '&-inline &-title': {
        padding: '8px 20px'
    }

});

'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    d3 = require('d3'),
    numeral = require('numeral'),
    DropDownContent = require('./DropDownContent'),
    ScrollableContent = require('./ScrollableContent'),
    styler = require('react-styler');

var ChartLegend = React.createClass({

    displayName: 'ChartLegend',

    propTypes: {
        limit: React.PropTypes.number,
        groupExtra: React.PropTypes.bool,
        collapsible: React.PropTypes.bool,
        renderItem: React.PropTypes.func,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        style: React.PropTypes.object,
        data: React.PropTypes.array,
        onOpen: React.PropTypes.func,
        OnClose: React.PropTypes.func,
        labelViewAll: React.PropTypes.string,
        labelClose: React.PropTypes.string,
        labelOther: React.PropTypes.string
    },

    mixins: [styler.mixinFor('ChartLegend')],

    /**
     * init
     */

    getDefaultProps: () => ({
        limit: 5,
        collapsible: true,
        labelViewAll: 'View all',
        labelClose: 'Close',
        labelOther: 'Other'
    }),

    getInitialState: () => ({
        opened: false,
        realContentWidth: null,
        realContentHeight: null
    }),

    /**
     * helpers
     */

    limit(data, limit) {
        limit = limit || this.props.limit;
        var sum = 0, sumPercentage = 0;
        return _.reduce(data, (result, item, index) => {
            sum += item['value'];
            if (index < limit || (this.props.groupExtra && data.length === limit + 1 && index === limit)) {
                result[index] = item;
                if (!_.isUndefined(item.percentage)) {
                    if (index === data.length - 1) {
                        result[index].percentage = 1 - sumPercentage;
                    } else {
                        result[index].percentage = parseFloat(item.percentage.toFixed(2));
                    }
                    sumPercentage += result[index].percentage;
                }
            } else if (this.props.groupExtra) {
                if (result[limit]) {
                    result[limit].value += item['value'];
                } else {
                    result[limit] = {
                        __isOther: true,
                        name: this.props.labelOther,
                        value: item['value'],
                        percentage: 1 - sumPercentage
                    };
                }
            }
            return result;
        }, []);
    },

    /**
     * handlers
     */

    handleClickViewAll() {
        this.props.onOpen && this.props.onOpen();
        this.setState({
            opened: true
        });
    },

    handleClickClose() {
        this.props.onClose && this.props.onClose();
        this.setState({
            opened: false
        });
    },

    /**
     * lifecycle
     */

    componentDidUpdate() {
        var ref = this.refs['scroll-content'], elem;
        if (!ref || !this.state.opened) {
            return;
        }
        ref = ref.refs['scroller'];
        if (ref && (elem = ReactDOM.findDOMNode(ref))) {
            _.defer(() => {
                this.isMounted() &&
                (elem.clientWidth !== this.state.realContentWidth ||
                elem.clientHeight !== this.state.realContentHeight) &&
                this.setState({
                    realContentWidth: elem.clientWidth,
                    realContentHeight: elem.clientHeight
                });
            });
        }
    },

    /**
     * render
     */

    render() {

        var cn = this.className;

        var style = _.extend({
            width: this.props.width,
            height: this.props.height
        }, this.props.style);

        var styleDropDown = {};

        var data = this.state.opened ?
            this.props.data :
            this.limit(this.props.data);

        var panelWidth = style.width;
        var panelHeight = this.state.opened ? window.innerHeight * 0.6 : style.height;

        var styleAll = this.getStyleComputed('view-all');
        var styleDropDownContent = this.getStyleComputed('expanded .DropDownContent');
        var scrollableWidth = panelWidth - 3;
        var scrollableHeight = panelHeight - styleAll.height - styleAll.paddingTop - styleDropDownContent.paddingTop;

        var shorterScroll = false;
        if (this.state.opened && this.state.realContentWidth && this.state.realContentHeight) {
            if (this.state.realContentWidth > scrollableWidth + 3) {
                scrollableWidth = this.state.realContentWidth + 20;
                panelWidth = scrollableWidth + 3;
            }
            if (this.state.realContentHeight < scrollableHeight) {
                shorterScroll = true;
                scrollableHeight = this.state.realContentHeight + styleDropDownContent.paddingTop;
                panelHeight = scrollableHeight + styleAll.height + styleAll.paddingTop;
            }
        }

        /* jshint ignore:start */
        var content = _.map(data, (item, index) =>
            this.props.renderItem && this.props.renderItem(item, index, this.state)
        );

        if (style.width && style.height) {
            content = <ScrollableContent
                ref='scroll-content' width={scrollableWidth} height={scrollableHeight}
                enabled={this.state.opened && !shorterScroll}>
                {content}
            </ScrollableContent>;
        } else {
            styleDropDown.position = 'static';
        }

        return <div style={style}
                    className={cn('', this.props.collapsible ? (this.state.opened ? 'expanded' : 'collapsed') : '')}>
            <DropDownContent width={panelWidth} height={panelHeight}
                             visible={true} enabled={this.state.opened} onHide={this.handleClickClose}
                             style={styleDropDown}>

                {content}

                {!_.isEmpty(this.props.data) &&
                this.props.data.length > this.props.limit + (this.props.groupExtra ? 1 : 0) &&
                this.props.collapsible && data.length !== this.props.data.length &&
                <div
                    className={cn('view-all')} style={{width: panelWidth}}
                    onClick={this.handleClickViewAll}>{this.props.labelViewAll}</div>}
                {!_.isEmpty(this.props.data) &&
                this.props.data.length > this.props.limit + (this.props.groupExtra ? 1 : 0) &&
                this.props.collapsible && data.length && data.length === this.props.data.length &&
                <div
                    className={cn('view-all')} style={{width: panelWidth}}
                    onClick={this.handleClickClose}>{this.props.labelClose}</div>}
            </DropDownContent>
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = ChartLegend;

/**
 * jss
 */

styler.registerComponentStyles('ChartLegend', {
    fontFamily: 'GothamBook, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: 20,
    lineHeight: '35px',
    userSelect: 'none',

    '& .DropDownContent': {
        transition: 'all 500ms cubic-bezier(0.165, 0.84, 0.44, 1)',
        boxShadow: 'none',
        border: 'none'
    },

    '&-collapsed .DropDownContent': {
        border: '1px solid rgba(219, 219, 219, 0)',
        paddingTop: 15
    },

    '&-expanded .DropDownContent': {
        backgroundColor: '#ffffff',
        border: '1px solid rgba(219, 219, 219, 1)',
        boxShadow: '0px 0px 10px 0px rgba(219, 219, 219, 0.5)',
        paddingTop: 15
    },

    '& .ScrollableContent': {
        padding: '0 20px',
        boxSizing: 'border-box'
    },

    '&-view-all': {
        height: 34,
        lineHeight: '34px',
        fontSize: 15,
        color: '#4872ef',
        textAlign: 'center',
        borderBottom: '1px solid #4872ef',
        paddingTop: 20,
        cursor: 'pointer',
        position: 'absolute',
        bottom: 0,
        boxSizing: 'content-box',
        background: '#ffffff'
    }

});

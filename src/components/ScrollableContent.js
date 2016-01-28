'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    IScroll = require('iscroll'),
    styler = require('react-styler');

var ScrollableContent = React.createClass({

    displayName: 'ScrollableContent',

    propTypes: {
        enabled: React.PropTypes.bool,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        style: React.PropTypes.object,
        scrollX: React.PropTypes.number,
        scrollY: React.PropTypes.number
    },

    mixins: [styler.mixinFor('ScrollableContent')],

    /**
     * init
     */

    getDefaultProps: () =>({
        scrollX: 0,
        scrollY: 0,
        enabled: true
    }),

    /**
     * helpers
     */

    enableScroll() {
        this.scroll = new IScroll(ReactDOM.findDOMNode(this), {
            bounce: false,
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale'
        });
        this.scroll.on('scrollStart', () => {
            this.inScroll = true;
        });
        this.scroll.on('scrollEnd', () => {
            this.inScroll = false;
        });
        this.scroll.on('scrollCancel', () => {
            this.inScroll = false;
        });
    },

    disableScroll() {
        if (this.scroll) {
            if (this.inScroll) {
                this.scroll.on('scrollEnd', () => {
                    this.inScroll = false;
                    this.destroyScroll();
                });
            } else {
                this.inScroll = false;
                this.destroyScroll();
            }
        }
        this.scroll = null;
    },

    destroyScroll() {
        try {
            this.scroll.scrollTo(0, 0);
            this.scroll.destroy();
        } catch (e) {
        }
    },

    /**
     * lifecycle
     */

    componentDidMount() {
        if (this.props.enabled) {
            this.enableScroll();
            this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(this.props.scrollX, this.props.scrollY);
        }
    },

    componentWillUnmount() {
        this.disableScroll();
    },

    componentDidUpdate(prevProps) {
        try {
            this.props.enabled && this.scroll && this.scroll.refresh && this.scroll.refresh();
            if (prevProps.scrollX !== this.props.scrollX || prevProps.scrollY !== this.props.scrollY) {
                this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(this.props.scrollX, this.props.scrollY);
            }
        } catch (e) {
        }
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.enabled && !this.props.enabled) {
            this.enableScroll();
        } else if (!nextProps.enabled && this.props.enabled) {
            this.disableScroll();
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

        /* jshint ignore:start */
        return <div style={style} className={cn()}>
            <div className={cn('scroller')} ref='scroller'>
                {this.props.children}
            </div>
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = ScrollableContent;

styler.registerComponentStyles('ScrollableContent', {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',

    '&-scroller': {
        position: 'absolute',
        width: 'inherit'
    },

    '& .iScrollIndicator': {
        backgroundColor: 'rgba(0,0,0,0.1) !important',
        border: 'none !important'
    },

    '& .iScrollVerticalScrollbar': {
        right: '2px !important'
    }
});

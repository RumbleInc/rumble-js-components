'use strict';

const React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    styler = require('react-styler');

const supportPageOffset = !_.isUndefined(window.pageXOffset);
const isCSS1Compatible = ((document.compatMode || '') === 'CSS1Compat');

const Sticky = React.createClass({

    displayName: 'Sticky',

    propTypes: {
        scrollContainer: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.object,
            React.PropTypes.func
        ]),
        offset: React.PropTypes.number,
        minLimitY: React.PropTypes.number,
        onOriginalPlace: React.PropTypes.func,
        onTop: React.PropTypes.func
    },

    mixins: [styler.mixinFor('Sticky')],

    // init

    getDefaultProps() {
        return {
            scrollContainer: window,
            offset: 0
        };
    },

    // helpers

    getScrollContainer(props) {
        props = props || this.props;
        let { scrollContainer } = props;
        if (_.isFunction(scrollContainer)) {
            scrollContainer = scrollContainer(this);
        }
        if (_.isString(scrollContainer)) {
            scrollContainer = document.querySelector(scrollContainer);
        }
        return scrollContainer || window;
    },

    start(props) {
        props = props || this.props;
        const cn = this.className;
        let { offset } = props;
        const scrollContainer = this.getScrollContainer(props);
        const root = ReactDOM.findDOMNode(this);
        const wrapper = ReactDOM.findDOMNode(this.refs['wrapper']);

        let hostSize = root.parentNode.getBoundingClientRect();

        const initScrollY = scrollContainer === window ?
            (supportPageOffset ?
                    window.pageYOffset :
                    (isCSS1Compatible ? document.documentElement.scrollTop : document.body.scrollTop)
            ) :
            scrollContainer.scrollTop;
        const initHostY = hostSize.top;
        let prevHostY = initHostY;

        const maxLimitY = initHostY + initScrollY;
        offset = _.isUndefined(offset) ? maxLimitY : offset;

        var widgetY = prevHostY;
        wrapper.style.position = 'fixed';
        const y = widgetY - maxLimitY;
        wrapper.style.transform = 'translate3d(0,' + y + 'px,0)';
        wrapper.style.width = (hostSize.width || root.offsetWidth) + 'px';
        root.style.width = root.parentNode.clientWidth + 'px';
        root.style.height = wrapper.clientHeight + 'px';

        // start listening scroll event
        this.handleScroll = () => {
            const hostY = root.getBoundingClientRect().top;
            widgetY += hostY - prevHostY;
            const minLimitY = _.isUndefined(props.minLimitY) ? -root.clientHeight : props.minLimitY;

            if (widgetY <= minLimitY) {
                widgetY = minLimitY;
            } else if (widgetY >= offset) {
                widgetY = offset;
            } else if (widgetY >= maxLimitY) {
                widgetY = maxLimitY;
            }
            if (hostY >= offset) {
                // on place
                widgetY = hostY;
                this.props.onOriginalPlace && this.props.onOriginalPlace();
                wrapper.className = cn('wrapper', 'wrapper-original');
            } else {
                this.props.onTop && this.props.onTop();
                wrapper.className = cn('wrapper', 'wrapper-top');
            }

            const y = widgetY - maxLimitY;
            wrapper.style.transform = 'translate3d(0,' + y + 'px,0)';
            wrapper.style.width = (hostSize.width || root.offsetWidth) + 'px';
            root.style.height = wrapper.clientHeight + 'px';
            prevHostY = hostY;
        };
        scrollContainer.addEventListener('scroll', this.handleScroll);

        // start listening resize event
        this.handleResize = () => {
            const hostSize = root.parentNode.getBoundingClientRect();
            wrapper.style.width = (hostSize.width || root.clientWidth) + 'px';
            root.style.width = (hostSize.width || root.clientWidth) + 'px';
            root.style.height = wrapper.clientHeight + 'px';
        };
        window.addEventListener('resize', this.handleResize);

        this.refresh = () => {
            this.handleResize();
            this.handleScroll();
        };
    },

    end(props) {
        // stop listening scroll event
        const scrollContainer = this.getScrollContainer(props || this.props);
        scrollContainer.removeEventListener('scroll', this.handleScroll);
        // stop listening resize event
        window.removeEventListener('resize', this.handleResize);
        this.refresh = _.noop;
    },

    refresh() {
    },

    // lifecycle

    componentDidMount() {
        this.start();
    },

    componentWillUnmount() {
        this.end();
    },

    // render

    render: function () {
        const cn = this.className;
        /* jshint ignore:start */
        return <div className={cn()}>
            <div ref='wrapper' className={cn('wrapper', 'wrapper-original')} style={this.props.style}>
                {this.props.children}
            </div>
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = Sticky;

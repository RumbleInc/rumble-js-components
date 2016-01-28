'use strict';

var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler');

var Tabs = React.createClass({

    displayName: 'Tabs',

    propTypes: {
        tabs: React.PropTypes.arrayOf(React.PropTypes.node),
        activeTab: React.PropTypes.node,
        style: React.PropTypes.object,
        onSelectTab: React.PropTypes.func
    },

    mixins: [styler.mixinFor('Tabs')],

    /**
     * init
     */

    getDefaultProps: () => ({
        activeTab: 0
    }),

    /**
     * handlers
     */

    handleClickTab(index) {
        _.isFunction(this.props.onSelectTab) && this.props.onSelectTab(index);
    },

    /**
     * render
     */

    render() {
        var cn = this.className;
        /* jshint ignore:start */
        return <div className={cn()} style={this.props.style}>
            <div className={cn('tabs-list')}>
                {_.map(this.props.tabs, (tab, index) => {
                    var isActive = (this.props.activeTab === index || this.props.activeTab === tab);
                    return <span
                        className={cn('tab', isActive ? 'tab-active' : 'tab-inactive')}
                        onClick={this.handleClickTab.bind(this, index)} key={index}>
                        {tab}
                    </span>;
                })}
            </div>
            <div className={cn('content')}>
                {this.props.children}
            </div>
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = Tabs;

styler.registerComponentStyles('Tabs', {
    '&-tabs-list': {
        backgroundColor: '#fafafa',
        padding: '10px 15px 0 16px'
    },
    '&-tab': {
        borderTop: '1px solid #dbdbdb',
        borderLeft: '1px solid #dbdbdb',
        borderRight: '1px solid #dbdbdb',
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        padding: '6px 20px',
        cursor: 'pointer',
        display: 'inline-block',
        color: '#747474',
        marginLeft: -1
    },
    '&-tab:hover': {
        color: '#4872ef'
    },
    '&-tab-active': {
        fontFamily: 'GothamMedium, "Helvetica Neue", Helvetica, Arial, sans-serif',
        backgroundColor: '#ffffff',
        color: '#4872ef'
    },
    '&-tab-inactive': {
        backgroundColor: '#ededed'
    },
    '&-content': {
        padding: 35,
        borderTop: '1px solid #dbdbdb',
        marginTop: -1
    }
});

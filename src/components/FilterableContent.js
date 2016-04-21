'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    Select = require('./Select'),
    Input = require('./Input'),
    Icon = require('./Icon'),
    styler = require('react-styler');

var FilterableContent = React.createClass({

    displayName: 'FilterableContent',

    propTypes: {
        data: React.PropTypes.array,
        sizeOptions: React.PropTypes.arrayOf(React.PropTypes.number),
        page: React.PropTypes.number,
        pageSize: React.PropTypes.number,
        searchString: React.PropTypes.string,
        filterPredicate: React.PropTypes.func,
        renderContent: React.PropTypes.func
    },

    mixins: [styler.mixinFor('FilterableContent')],

    /**
     * init
     */

    getDefaultProps: () => ({
        sizeOptions: [10, 25, 50, 100],
        page: 0,
        pageSize: 10,
        searchString: '',
        showSearchFilter: true,
        showPageSize: true
    }),

    getInitialState() {
        return {
            page: this.props.page,
            pageSize: this.props.pageSize.toString(),
            searchString: this.props.searchString
        };
    },

    /**
     * helpers
     */

    filterPredicate(searchString, item) {
        var search = item;
        if (_.isObject(item)) {
            search = JSON.stringify(item);
        }
        return search.toLowerCase().indexOf(searchString) !== -1;
    },

    /**
     * handlers
     */

    handleChangePageSize(event) {
        this.setState({
            page: 0,
            pageSize: event.target.value
        });
    },

    handleClickStartSearch() {
        this.setState({inSearch: true}, () => {
            if (this.refs['search']) {
                ReactDOM.findDOMNode(this.refs['search']).querySelector('input').focus();
            }
        });
    },

    handleChangeSearchString(event) {
        this.setState({
            page: 0,
            searchString: event.target.value
        });
    },

    handleBlurSearch() {
        if (!this.state.searchString) {
            this.setState({inSearch: false});
        }
    },

    handleClickClearSearch() {
        this.setState({inSearch: false});
    },

    handleClickPage(page) {
        this.setState({
            page: page
        });
    },

    /**
     * lifecycle
     */

    componentWillReceiveProps(nextProps) {
        if (nextProps.data && nextProps.data.length !== this.props.data.length) {
            this.setState({
                page: 0
            });
        }
    },

    /**
     * render
     */

    render() {
        var cn = this.className;

        var filteredData = this.props.data;
        var countAll = filteredData.length;

        // search
        if (this.state.searchString) {
            var filterPredicate = this.props.filterPredicate || this.filterPredicate;
            filteredData = _.filter(filteredData, (item, key) => {
                return filterPredicate(this.state.searchString.toLowerCase(), item, key);
            });
        }
        var countFound = filteredData.length;

        // page
        var pageSize = parseInt(this.state.pageSize);
        var start = this.state.page * pageSize;
        var end = (this.state.page + 1) * pageSize;
        filteredData = filteredData.slice(start, end);

        var sizeOptions = _.map(this.props.sizeOptions, (size) => {
            var value = size.toString();
            return {
                value: value,
                label: value
            };
        });

        var lastPage = Math.ceil(countFound / pageSize) - 1;
        var pages = [0];
        if (lastPage > 0) {
            if (this.state.page < 4) {
                pages = pages.concat(_.range(1, Math.min(5, lastPage)));
                if (lastPage > 5) {
                    pages.push(null);
                }
            } else if (lastPage - this.state.page < 4) {
                if (lastPage - 4 > 1) {
                    pages.push(null);
                }
                pages = pages.concat(_.range(Math.max(1, lastPage - 4), lastPage));
            } else {
                pages.push(null);
                pages.push(this.state.page - 1);
                pages.push(this.state.page);
                pages.push(this.state.page + 1);
                pages.push(null);
            }
            pages.push(lastPage);
        }

        /* jshint ignore:start */
        return <div className={cn()} style={this.props.style}>
            {(this.props.showPageSize || this.props.showSearchFilter) && <div className={cn('top')}>
                {this.props.showPageSize && <span className={cn('top-left')}>
                    Show
                    <Select
                        className={cn('size')} options={sizeOptions} value={this.state.pageSize} width={65}
                        onChange={this.handleChangePageSize}/>
                </span>}
                {this.props.showSearchFilter && <span className={cn('top-right')}>
                        {this.state.inSearch ?
                            <Input ref='search' className={cn('search')} type='text' placeholder='Search'
                                   allowClear={true}
                                   onChange={this.handleChangeSearchString} onBlur={this.handleBlurSearch}
                                   onClickClear={this.handleClickClearSearch}/> :
                            <Icon icon='search' style={{
                                padding: 7,
                                marginRight: -7
                            }} onClick={this.handleClickStartSearch}/>}
                </span>}
            </div>}
            {this.props.renderContent && this.props.renderContent(filteredData)}
            <div className={cn('bottom')}>
                <span className={cn('bottom-left', 'page-status')}>
                    {'Showing ' + Math.min(start + 1, countFound) + ' to ' +
                    Math.min(end, countFound) + ' of ' + countFound + ' entries' +
                    (countFound !== countAll ? ' (filtered from ' + countAll + ' total entries)' : '')}
                </span>
                {lastPage > 0 && <span className={cn('bottom-right', 'pager')}>
                    <span key='prev'
                          className={cn('pager-item', start === 0 ? 'pager-item-disabled' : 'pager-item-enabled')}
                          onClick={start > 0 ? this.handleClickPage.bind(this, this.state.page - 1) : undefined}>
                        Previous
                    </span>
                    {_.map(pages, (page, index) => {
                        if (_.isNull(page)) {
                            return <span key={index} className={cn('pager-item', 'pager-item-disabled')}>...</span>
                        } else {
                            var classes = ['pager-item', 'pager-item-enabled'];
                            if (page === this.state.page) {
                                classes.push('pager-item-active');
                            }
                            return <span
                                key={index} className={cn(classes)}
                                onClick={this.handleClickPage.bind(this, page)}>{page + 1}</span>
                        }
                    })}
                    <span key='next'
                          className={cn('pager-item', end >= countFound ? 'pager-item-disabled' : 'pager-item-enabled')}
                          onClick={end < countFound ? this.handleClickPage.bind(this, this.state.page + 1) : undefined}>
                        Next
                    </span>
                </span>}
            </div>
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = FilterableContent;

styler.registerComponentStyles('FilterableContent', {
    '&-size': {
        marginLeft: 10
    },

    '&-search .Input-input, &-search .Input-input:focus': {
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: '1px solid #a3b8f7',
        borderLeft: 'none',
        padding: '0 18px 0 0',
        color: '#999999',
        boxShadow: 'none'
    },

    '&-page-status': {
        color: '#999999'
    },

    '&-pager': {
        marginRight: -10,
        userSelect: 'none'
    },
    '&-pager-item': {
        padding: 10
    },
    '&-pager-item-disabled': {
        color: '#d4d4d4',
        cursor: 'default'
    },
    '&-pager-item-enabled': {
        cursor: 'pointer',
        color: '#4471ee'
    },
    '&-pager-item-enabled:hover': {
        color: '#464646'
    },
    '&-pager-item-active': {
        color: '#464646'
    },

    '&-top': {
        marginBottom: 30,
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
    },
    '&-top-left': {},
    '&-top-right': {},
    '&-bottom': {
        marginTop: 25,
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
    },
    '&-bottom-left': {},
    '&-bottom-right': {}
});

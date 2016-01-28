'use strict';

var React = require('react'),
    styler = require('react-styler'),
    Loading = require('./Loading'),
    Button = require('./Button');

var ButtonLoading = React.createClass({

    displayName: 'ButtonLoading',

    mixins: [styler.mixinFor('ButtonLoading')],

    /**
     * init
     */

    getDefaultProps: () => ({
        width: 'auto',
        loadingSize: 30,
        loadingType: 'spin'
    }),

    /**
     * render
     */

    render() {
        var cn = this.className;

        /* jshint ignore:start */
        return this.props.loading
            ? <div className={cn()} style={{width: this.props.width}}>
            <Loading size={this.props.loadingSize} type={this.props.loadingType} />
        </div>
            : <Button {...this.props}/>;
        /* jshint ignore:end */
    }

});

module.exports = ButtonLoading;

styler.registerComponentStyles('ButtonLoading', {
    textAlign: 'center',
    display: 'inline-block',
    verticalAlign: 'middle',

    '& .Loading': {
        display: 'inline-block',
        position: 'relative'
    },

    '& .Loading svg': {
        fill: '#696969'
    }

});

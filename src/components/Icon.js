'use strict';

var React = require('react'),
    _ = require('lodash'),
    styler = require('react-styler'),
    icons = require('../icons');

var preload = {};

var Icon = React.createClass({

    displayName: 'Icon',

    propTypes: {
        icon: React.PropTypes.string,
        src: React.PropTypes.string,
        style: React.PropTypes.object,
        onClick: React.PropTypes.func,
        onMouseOver: React.PropTypes.func,
        onMouseMove: React.PropTypes.func,
        onMouseOut: React.PropTypes.func,
        disabled: React.PropTypes.bool,
        hover: React.PropTypes.bool
    },

    mixins: [styler.mixinFor('Icon')],

    /**
     * render
     */

    render() {
        var cn = this.className;

        var styleIcon = {};

        var src = this.props.src || icons[this.props.icon];
        if (src) {
            styleIcon.backgroundImage = 'url("' + src + '")';
            if (!preload[this.props.icon]) {
                var icon = new Image();
                icon.onload = () => {
                    preload[this.props.icon] = {
                        width: icon.width,
                        height: icon.height
                    };
                    this.isMounted() && this.forceUpdate();
                };
                icon.src = src;
                preload[this.props.icon] = {
                    width: icon.width,
                    height: icon.height
                };
            }
            if (preload[this.props.icon].width) {
                styleIcon.width = preload[this.props.icon].width;
            }
            if (preload[this.props.icon].height) {
                styleIcon.height = preload[this.props.icon].height;
            }
        }

        if (!this.props.disabled && this.props.onClick) {
            styleIcon.cursor = 'pointer';
        }

        _.extend(styleIcon, this.props.style);

        var classes = ['', this.props.icon, this.props.disabled ? 'disabled' : 'enabled'];
        if (this.props.hover) {
            classes.push('hover');
        }

        /* jshint ignore:start */
        return <span style={styleIcon} className={cn(classes)}
            onClick={!this.props.disabled && this.props.onClick}
            onMouseOver={!this.props.disabled && this.props.onMouseOver}
            onMouseOut={!this.props.disabled && this.props.onMouseOut}
            onMouseMove={!this.props.disabled && this.props.onMouseMove}
        />;
        /* jshint ignore:end */
    }

});

module.exports = Icon;

styler.registerComponentStyles('Icon', _.extend(
    {
        display: 'inline-block',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center'
    },
    makeIconStyles('overflow', 4, 18),
    makeIconStyles('search', 17, 16),
    makeIconStyles('arrow_down', 8, 6),
    makeIconStyles('trash', 13, 12),
    makeIconStyles('duplicate', 21, 17),
    makeIconStyles('edit', 21, 19),
    makeIconStyles('analytics', 22, 13),
    makeIconStyles('os_android_small_bright', 20, 24, 'os_android_sml_bright', 'os_android_sml_hover'),
    makeIconStyles('os_android_small_dark', 20, 24, 'os_android_sml_dark', 'os_android_sml_hover'),
    makeIconStyles('os_android_small_white', 20, 24, 'os_android_sml_white', 'os_android_sml_hover'),
    makeIconStyles('os_ios_small_bright', 19, 24, 'os_ios_sml_bright', 'os_ios_sml_hover'),
    makeIconStyles('os_ios_small_dark', 19, 24, 'os_ios_sml_dark', 'os_ios_sml_hover'),
    makeIconStyles('os_ios_small_white', 19, 24, 'os_ios_sml_white', 'os_ios_sml_hover'),
    makeIconStyles('os_web_small_bright', 19, 19, 'os_web_sml_bright', 'os_web_sml_hover'),
    makeIconStyles('os_web_small_dark', 19, 19, 'os_web_sml_dark', 'os_web_sml_hover'),
    makeIconStyles('download_excel', 20, 20),
    makeIconStyles('arrow_left_sml', 7, 12),
    makeIconStyles('arrow_right_sml', 7, 12),
    makeIconStyles('remove_label', 10, 10),
    makeIconStyles('trash_red', 13, 12),
    makeIconStyles('trash_white', 13, 12),
    makeIconStyles('upload', 14, 16),
    makeIconStyles('map_zoom_in', 28, 28),
    makeIconStyles('map_zoom_out', 28, 28),
    makeIconStyles('preview', 20, 12, 'preview_normal', 'preview_hover', 'preview_grey_normal'),
    makeIconStyles('info', 18, 18),
    makeIconStyles('articles', 23, 18),
    makeIconStyles('authors', 21, 22),
    makeIconStyles('channels', 21, 16),
    makeIconStyles('favorites', 21, 21),
    makeIconStyles('leaderboards', 26, 9),
    makeIconStyles('overview', 25, 15)
));

function makeIconStyles(name, width, height, normal, hover, disabled) {

    var styles = {};
    normal = normal || name + '_normal';
    hover = hover || name + '_hover';
    disabled = disabled || name + '_disabled';

    styles['&-' + name] = {
        width: width,
        height: height
    };
    if (icons[normal]) {
        styles['&-' + name].backgroundImage = 'url("' + icons[normal] + '")';
    }
    if (icons[disabled]) {
        styles['&-disabled&-' + name + ', .Button-disabled &-' + name] = {
            backgroundImage: 'url("' + icons[disabled] + '")'
        };
    }
    if (icons[hover]) {
        styles['&-enabled&-' + name + ':hover, .Button:hover &-enabled&-' + name + ', &-enabled&-hover&-' + name] = {
            backgroundImage: 'url("' + icons[hover] + '")'
        };
    }
    return styles;

}

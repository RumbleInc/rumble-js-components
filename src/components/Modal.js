/**
 * Modal
 * implement modal window
 *
 * @example
 * <Modal title="Title" ref="modal" closable={true} showButtons={true} width={400}>
 *     content of modal window
 * </Modal>
 *
 *
 */

'use strict';
var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    getOffset = require('../helpers/getOffset'),
    styler = require('react-styler'),
    mixinDropDownPosition = require('../mixins/mixinDropDownPosition'),
    Button = require('./Button'),
    DropDownContent = require('./DropDownContent');

var Modal = React.createClass({

    displayName: 'Modal',

    propTypes: {
        title: React.PropTypes.string,
        buttons: React.PropTypes.arrayOf(React.PropTypes.shape({
            type: React.PropTypes.string,
            caption: React.PropTypes.string,
            onClick: React.PropTypes.func
        })),
        visible: React.PropTypes.bool,
        closable: React.PropTypes.bool,
        overlayVisible: React.PropTypes.bool,
        overlayFull: React.PropTypes.bool,
        overlayEffects: React.PropTypes.string,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        onClose: React.PropTypes.func
    },

    mixins: [styler.mixinFor('Modal'), mixinDropDownPosition],

    // init

    getDefaultProps: () => ({
        visible: true,
        position: 'middle center',
        align: 'middle center',
        target: document.documentElement,
        closable: false,
        overlayVisible: true,
        overlayFull: true,
        fixed: true
    }),

    getInitialState() {
        return {
            visible: this.props.visible
        };
    },

    // helpers

    getTarget() {
        return _.isFunction(this.props.target) ?
            this.props.target() :
            (this.props.target || (ReactDOM.findDOMNode(this) && ReactDOM.findDOMNode(this).parentNode));
    },

    _show() {
        if (_.isUndefined(this.bodyOverflow)) {
            this.bodyOverflow = document.body.style.overflow;
        }
        document.body.style.overflow = 'hidden';

        if (this.props.overlayVisible) {
            this.overlay.style.display = 'block';

            var target = this.getTarget();

            if (this.props.overlayEffects) {
                if (_.isUndefined(this.targetFilter)) {
                    this.targetFilter = target.style.filter;
                }
                if (_.isUndefined(this.targetWebkitFilter)) {
                    this.targetWebkitFilter = target.style.WebkitFilter;
                }
                target.style.filter = this.props.overlayEffects;
                target.style.WebkitFilter = this.props.overlayEffects;
            } else {
                this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            }

            if (this.props.overlayFull) {
                this.overlay.style.left = '0px';
                this.overlay.style.top = '0px';
                this.overlay.style.width = '100%';
                this.overlay.style.height = '100%';
            } else {
                var offset = getOffset(target);
                this.overlay.style.left = offset.left + 'px';
                this.overlay.style.top = offset.top + 'px';
                this.overlay.style.width = target.clientWidth + 'px';
                this.overlay.style.height = target.clientHeight + 'px';
            }
        }

        this.modalRootElement.style.left = 'initial';
        this.modalRootElement.style.top = 'initial';
        this.modalRootElement.style.visibility = 'visible';
        this.focusButton();
    },

    _hide() {
        this.overlay.style.display = 'none';
        this.modalRootElement.style.visibility = 'hidden';
        this.modalRootElement.style.left = '-100000px';
        this.modalRootElement.style.top = '-100000px';
        ReactDOM.render(this.render(), this.modalRootElement);
        if (!_.isUndefined(this.bodyOverflow)) {
            document.body.style.overflow = this.bodyOverflow;
            this.bodyOverflow = undefined;
        }
        if (!_.isUndefined(this.targetFilter)) {
            this.getTarget().style.filter = this.targetFilter;
            this.targetFilter = undefined;
        }
        if (!_.isUndefined(this.targetWebkitFilter)) {
            this.getTarget().style.WebkitFilter = this.targetWebkitFilter;
            this.targetWebkitFilter = undefined;
        }
    },

    focusButton() {
        var selector = '.' + this.className('buttons') + ' .Button';
        var buttons = this.modalRootElement.querySelectorAll(selector);
        var button = _.find(buttons, button => {
            return !button.classList.contains('.Button-disabled');
        });
        button && button.focus();
    },

    // handlers

    handleWindowResize() {
        if (this.state.visible) {
            this.show();
        } else {
            this.hide();
        }
    },

    handleCloseClick() {
        if (this.props.onClose && this.props.visible) {
            this.props.onClose();
        }
    },

    handleKeyPress(event) {
        if (this.props.onClose &&
            this.props.visible && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey &&
            event.keyCode === 27) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            this.props.onClose();
        }
    },

    // lifecycle

    componentWillMount() {
        var cn = this.className;
        // mount overlay
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = cn('overlay');
            document.body.appendChild(this.overlay);
        }
        if (!this.modalRootElement) {
            this.modalRootElement = document.createElement('div');
            this.modalRootElement.className = cn('root');
            document.body.appendChild(this.modalRootElement);
        }
        this.setState({
            root: '.' + cn().split(' ').pop()
        });
        window.addEventListener('resize', this.handleWindowResize);

        if (this.props.onClose) {
            //this.overlay.addEventListener('click', this.handleCloseClick);
            this.modalRootElement.addEventListener('keydown', this.handleKeyPress);
        }
    },

    componentDidMount() {
        if (this.props.visible) {
            this.show();
            this._show();
        }
    },

    componentWillUnmount() {
        this._hide();
        window.removeEventListener('resize', this.handleWindowResize);
        this.overlay.removeEventListener('click', this.handleCloseClick);
        this.modalRootElement.removeEventListener('keydown', this.handleKeyPress);
    },

    componentWillReceiveProps(nextProps) {
        if (!_.isUndefined(nextProps.visible)) {
            this.setState({
                visible: nextProps.visible
            });
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.state.visible !== prevState.visible) {
            if (this.state.visible) {
                this._show();
            } else {
                this._hide();
                this.props.onClose && this.props.onClose();
            }
        }

        ReactDOM.render(this.renderModal(), this.modalRootElement, () => {
            if (!this.alreadyRendered) {
                //this .modalRootElement.children[0] && this.modalRootElement.children[0].focus();
                this.focusButton();
            }
            this.alreadyRendered = true;
        });
    },

    // render

    renderModal() {
        var cn = this.className;

        var style = _.extend({}, this.props.style, this.state.style, {
            left: this.state.left,
            top: this.state.top,
            width: this.props.width,
            height: this.props.height
        });

        /* jshint ignore:start */
        return <DropDownContent className={cn('', this.props.fixed ? 'fixed' : 'absolute')} style={style}
                                visible={this.state.visible} enabled={true} arrowSize={false}>
            {this.props.title && <div className={cn('header-container')}>
                <span className={cn('title')}>{this.props.title}</span>
                {this.props.closable && <Button caption='Close' onClick={this.handleCloseClick} type='close' size='small'/>}
            </div>}
            <div className={cn('content')}>
                {this.state.content || this.props.children}
            </div>
            {this.props.buttons && <div className={cn('buttons', 'buttons-' + this.props.buttons.length)}>
                {_.map(this.props.buttons, (button, index) => <Button {...button} key={index}/>)}
            </div>}
            {this.props.footer && <div className={cn('footer')}>{this.props.footer}</div>}
        </DropDownContent>;
        /* jshint ignore:end */
    },

    render() {
        /* jshint ignore:start */
        return <div></div>;
        /* jshint ignore:end */
    }

});

module.exports = Modal;

styler.registerComponentStyles('Modal', {

    backgroundColor: '#ffffff',
    maxHeight: '100vh',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',

    '&-overlay': {
        display: 'none',
        position: 'fixed',
        zIndex: '100'
    },

    '&-root': {
        fontFamily: 'GothamBook, "Helvetica Neue", Helvetica, Arial, sans-serif',
        color: '#464646'
    },

    '&-modal': {
        border: '1px solid #dbdbdb'
    },

    '&-fixed': {
        position: 'fixed'
    },

    '&-absolute': {
        position: 'absolute'
    },

    '&-title': {
        fontSize: 22
    },

    '&-content': {
        fontSize: 16,
        lineHeight: '1.4em',
        padding: '15px 20px'
    },

    '&-buttons': {
        padding: 20,
        textAlign: 'right'
    },

    '&-buttons-1': {
        textAlign: 'center'
    },
    '&-footer': {
        fontSize: '0.8em',
        textAlign: 'center',
        marginBottom: '18px',
        color: '#aeaeae'
    },
    '&-header-container':{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #dbdbdb',
        padding: '8px 20px',
        height: 50
    }

});

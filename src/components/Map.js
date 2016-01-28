'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    styler = require('react-styler');

var loadGoogleApi;

var geolocation = navigator.geolocation;
if (!geolocation) {
    geolocation = {
        getCurrentPosition(success, failure) {
            failure('Your browser doesn\'t support geolocation.');
        }
    };
}

var MapComponent = React.createClass({

    displayName: 'Map',

    propTypes: {
        zoom: React.PropTypes.number,
        latitude: React.PropTypes.number,
        longitude: React.PropTypes.number,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        style: React.PropTypes.object,
        onBoundsChange: React.PropTypes.func,
        onCenterChange: React.PropTypes.func,
        onPlaceSelect: React.PropTypes.func
    },

    mixins: [styler.mixinFor('Map')],

    /**
     * init
     */

    getDefaultProps() {
        return {
            zoom: 4,
            latitude: 40.7471279,
            longitude: -73.991786
        };
    },

    getInitialState() {
        return {
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            zoom: this.props.zoom
        };
    },

    /**
     * helpers
     */

    getCenter(state) {
        state = state || this.state;
        return new google.maps.LatLng(state.latitude, state.longitude);
    },

    /**
     * lifecycle
     */

    componentDidMount() {

        var callbackFuncName = 'mapCallbackReact' + Math.ceil(Math.random() * 100000000);

        loadGoogleApi = new Promise((resolve, reject) => {
            window[callbackFuncName] = () => {
                resolve();
            };
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?sensor=true&' +
                'language=en-US&libraries=places&callback=' + callbackFuncName;
            document.body.appendChild(script);
        });

        loadGoogleApi.then(() => {

            var mapOptions = {
                center: this.getCenter(),
                mapTypeControl: false,
                overviewMapControl: false,
                panControl: false,
                rotateControl: false,
                scaleControl: true,
                scaleControlOptions: google.maps.ScaleControlStyle.DEFAULT,
                streetViewControl: false,
                zoom: this.props.zoom,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM,
                    style: google.maps.ZoomControlStyle.DEFAULT
                }
            };
            this.map = new google.maps.Map(ReactDOM.findDOMNode(this.refs['map']), mapOptions);

            //var input = ReactDOM.findDOMNode(this.refs['search']);
            //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
            //
            //var searchBox = new google.maps.places.SearchBox(input);

            var markers = [];

            //google.maps.event.addListener(searchBox, 'places_changed', () => {
            //    var places = searchBox.getPlaces();
            //
            //    if (places.length === 0) {
            //        return;
            //    }
            //    _.each(markers, (marker) => {
            //        marker.setMap(null);
            //    });
            //
            //    markers = [];
            //    var bounds = new google.maps.LatLngBounds();
            //    _.each(places, (place) => {
            //
            //        var marker = new google.maps.Marker({
            //            map: this.map,
            //            icon: {
            //                url: place.icon,
            //                size: new google.maps.Size(71, 71),
            //                origin: new google.maps.Point(0, 0),
            //                anchor: new google.maps.Point(17, 34),
            //                scaledSize: new google.maps.Size(25, 25)
            //            },
            //            title: place.name,
            //            position: place.geometry.location
            //        });
            //
            //        markers.push(marker);
            //        bounds.extend(place.geometry.location);
            //    });
            //
            //    if (places.length === 1) {
            //        try {
            //            this.map.fitBounds(places[0].geometry.viewport);
            //            this.props.onPlaceSelect && this.props.onPlaceSelect(_.cloneDeep(places[0]));
            //        } catch (e) {
            //            this.map.fitBounds(bounds);
            //            this.map.setZoom(Math.min(this.state.zoom, 10));
            //        }
            //    } else {
            //        this.map.fitBounds(bounds);
            //        this.map.setZoom(Math.min(this.state.zoom, 10));
            //    }
            //});

            google.maps.event.addListener(this.map, 'bounds_changed', () => {
                var bounds = this.map.getBounds();
                //searchBox.setBounds(bounds);

                this.props.onBoundsChange && this.props.onBoundsChange({
                    latitude: bounds.getCenter().lat(),
                    longitude: bounds.getCenter().lng()
                });
            });

            google.maps.event.addListener(this.map, 'center_changed', () => {
                this.props.onCenterChange && this.props.onCenterChange({
                    latitude: this.map.getCenter().lat(),
                    longitude: this.map.getCenter().lng()
                });
            });

            google.maps.event.addListener(this.map, 'zoom_changed', () => {
                this.setState({
                    zoom: this.map.getZoom()
                });
            });

            geolocation.getCurrentPosition((position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            });

        });

    },

    //componentWillReceiveProps(nextProps) {
    //    var state = {};
    //    var propsToState = ['latitude', 'longitude', 'zoom'];
    //    _.each(propsToState, (key) => {
    //        if (this.props[key] !== nextProps[key]) {
    //            state[key] = nextProps[key];
    //        }
    //    });
    //    this.setState(state);
    //},
    //
    //componentWillUpdate(nextProps, nextState) {
    //    if (this.state.latitude !== nextState.latitude || this.state.longitude !== nextState.longitude) {
    //        this.map.setCenter(this.getCenter(nextState));
    //    }
    //    if (this.state.zoom !== nextState.zoom) {
    //        this.map.setZoom(nextState.zoom);
    //    }
    //},

    /**
     * render
     */

    render() {
        var cn = this.className;

        var style = _.extend({
            width: this.props.width,
            height: this.props.height
        }, this.props.style);

        //<input className={cn('search')} type='text' ref='search' />
        /* jshint ignore:start */
        return <div className={cn()}>
            <div className={cn('map')} style={style} ref='map'></div>
        </div>;
        /* jshint ignore:end */
    }

});

module.exports = MapComponent;

styler.registerComponentStyles('Map', {
    display: 'inline-block',

    '&-map': {
        width: 584,
        height: 400
    },

    '&-search': {
        position: 'absolute',
        color: '#464646',

        marginTop: 16,
        border: '1px solid transparent',
        borderRadius: '2px 0 0 2px',
        boxSizing: 'border-box',
        height: 32,
        outline: 'none',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',

        backgroundColor: '#fff',
        fontSize: 15,
        marginLeft: 12,
        padding: '0 11px 0 13px',
        textOverflow: 'ellipsis',
        width: 500
    }

});

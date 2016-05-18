(function () {
    'use strict';
    angular
        .module('app.zone')
        .directive("appMap", function () {
            return {
                restrict: "E",
                replace: true,
                template: "<div></div>",
                scope: {
                    center: "=",        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
                    markers: "=",       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
                    width: "@",         // Map width in pixels.
                    height: "@",        // Map height in pixels.
                    zoom: "@",          // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
                    mapTypeId: "@",     // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
                    panControl: "@",    // Whether to show a pan control on the map.
                    zoomControl: "@",   // Whether to show a zoom control on the map.
                    scaleControl: "@",   // Whether to show scale control on the map.
                    model: '=ngModel'
                },

                link: function (scope, element) {
                    var toCenter;
                    var map;
                    var currentMarkers;
                    var range;

                    // listen to changes in scope variables and update the control
                    var arr = ["width", "height", "markers", "mapTypeId", "panControl", "zoomControl", "scaleControl"];
                    for (var i = 0, cnt = arr.length; i < arr.length; i++) {
                        scope.$watch(arr[i], function () {
                            cnt--;
                            if (cnt <= 0) {
                                updateControl();
                            }
                        });
                    }

                    // update zoom without re-creating the map
                    scope.$watch("zoom", function () {
                        if (map && scope.zoom)
                            map.setZoom(scope.zoom * 1);
                    });

                    // update center without re-creating the map
                    scope.$watch("center", function () {
                        if (map && scope.center)
                            map.setCenter(getLocation(scope.center));
                    });

                    // update range
                    scope.$watch('model', function (value) {
                        range = value;
                        updateControl();
                    });

                    /**
                     * @description update map control
                     * @method updateControl
                     */
                    function updateControl() {

                        // update size
                        if (scope.width) element.width(scope.width);
                        if (scope.height) element.height(scope.height);

                        // get map options
                        var options =
                        {
                            center: new google.maps.LatLng(3.139003, 101.68685499999992),
                            zoom: 15,
                            mapTypeId: "roadmap" // map type
                        };

                        if (scope.center) options.center = getLocation(scope.center);
                        if (scope.zoom) options.zoom = scope.zoom * 1;
                        if (scope.mapTypeId) options.mapTypeId = scope.mapTypeId;
                        if (scope.panControl) options.panControl = scope.panControl;
                        if (scope.zoomControl) options.zoomControl = scope.zoomControl;
                        if (scope.scaleControl) options.scaleControl = scope.scaleControl;

                        // create the map
                        map = new google.maps.Map(element[0], options);

                        // create map black design
                        mapBlackDesign();

                        // update markers
                        updateMarkers();

                        // listen to changes in the center property and update the scope
                        google.maps.event.addListener(map, 'center_changed', function () {

                            // do not update while the user pans or zooms
                            if (toCenter) clearTimeout(toCenter);
                            toCenter = setTimeout(function () {
                                if (scope.center) {

                                    // check if the center has really changed
                                    if (map.center.lat() != scope.center.lat ||
                                        map.center.lng() != scope.center.lon) {

                                        // update the scope and apply the change
                                        scope.center = {lat: map.center.lat(), lon: map.center.lng()};
                                        if (!scope.$$phase) scope.$apply("center");
                                    }
                                }
                            }, 500);

                        });
                    }

                    /**
                     * @description update map markers to match scope marker collection
                     * @method updateMarkers
                     */
                    function updateMarkers() {

                        if (map && scope.markers) {

                            // create new markers
                            currentMarkers = [];
                            var markers = scope.markers;
                            if (angular.isString(markers)) markers = scope.$eval(scope.markers);

                            for (var i = 0; i < markers.length; i++) {

                                var m = markers[i];
                                var loc = new google.maps.LatLng(m.lat, m.lon);

                                // assign position to marker
                                var marker = new google.maps.Marker({
                                    position: loc,
                                    map: map,
                                    title: "location",
                                    animation: google.maps.Animation.DROP
                                });

                                // Custom marker
                                // options:{icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'}

                                // Create circle object
                                var circle = new google.maps.Circle({
                                    map: map,
                                    radius: parseInt(range), // DOM element returns a string value, needs to be converted to integer
                                    strokeOpacity: 0,
                                    fillColor: "#03A9F4",
                                    fillOpacity: 0.2
                                });

                                // assign circle to marker
                                marker.circle = circle;

                                // bind circle to map
                                circle.bindTo('map', marker);

                                // bind circle to specific position
                                circle.bindTo('center', marker, 'position');

                                // push markers
                                currentMarkers.push(marker);
                            }
                        }
                    }

                    /**
                     * @description convert current location to Google maps location
                     * @method getLocation
                     * @param {object} loc object for latitude and longitude
                     * @return NewExpression
                     */
                    function getLocation(loc) {
                        if (loc == null) return new google.maps.LatLng(40, -73);
                        if (angular.isString(loc)) loc = scope.$eval(loc);
                        return new google.maps.LatLng(loc.lat, loc.lon);
                    }

                    /**
                     * @description change google map default design to black
                     * @method mapBlackDesign
                     */
                    function mapBlackDesign() {
                        map.set('styles', [
                            {
                                "featureType": "all",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "saturation": 36
                                    },
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 40
                                    }
                                ]
                            },
                            {
                                "featureType": "all",
                                "elementType": "labels.text.stroke",
                                "stylers": [
                                    {
                                        "visibility": "on"
                                    },
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 16
                                    }
                                ]
                            },
                            {
                                "featureType": "all",
                                "elementType": "labels.icon",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "administrative",
                                "elementType": "geometry.fill",
                                "stylers": [
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 20
                                    }
                                ]
                            },
                            {
                                "featureType": "administrative",
                                "elementType": "geometry.stroke",
                                "stylers": [
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 17
                                    },
                                    {
                                        "weight": 1.2
                                    }
                                ]
                            },
                            {
                                "featureType": "landscape",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 20
                                    }
                                ]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 21
                                    }
                                ]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "geometry.fill",
                                "stylers": [
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 17
                                    }
                                ]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "geometry.stroke",
                                "stylers": [
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 29
                                    },
                                    {
                                        "weight": 0.2
                                    }
                                ]
                            },
                            {
                                "featureType": "road.arterial",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 18
                                    }
                                ]
                            },
                            {
                                "featureType": "road.local",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 16
                                    }
                                ]
                            },
                            {
                                "featureType": "transit",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 19
                                    }
                                ]
                            },
                            {
                                "featureType": "water",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 17
                                    }
                                ]
                            }
                        ]);
                    }
                }

            };
        });

})();

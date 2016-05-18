(function () {


    'use strict';
    /**
     * @module app.zone
     * @description module app.zone
     * @inject {} angularUtils.directives.dirPagination
     */
    angular.
        module('app.zone', ['angularUtils.directives.dirPagination'])
        .controller('ZoneCtrl', zoneController)
        .controller('ModalZoneCtrl', modalZoneController)
        .controller('ModalInstanceCtrl', modalInstanceController)
        .controller('GeocodeCtrl', geocodeController)

    /**
     * @description zone module main controller
     * @method zoneController
     * @param {object} $scope
     * @param {service} ZoneService
     */
    function zoneController($scope, RequestService, session, notify) {
        $scope.zones = [];

        var params = {
            "cmp_cd": session.getUser().user.cmp_cd
        }

        // Load zones into $scope
        RequestService.postJsonRequest('zone/findZoneByCompanyId', params).then(function (data) {

            if (data.result == "this model doesn't exist") {
                notify({
                    message: "You have 0 zone!",
                    classes: 'alert-info',
                    position: 'center',
                    duration: 2000
                });
            } else {
                $scope.zones = data;
            }
        })


        /**
         * @description delete row from zone table
         * @method removeZoneRow
         * @param {int} id
         */
        $scope.removeZoneRow = function (id) {

            params = {
                "zone_cd": id
            };

            RequestService.postJsonRequest('zone/deleteZone', params).then(function (data) {

                if (data.result == "deleted successfully") {

                    var index = -1;
                    for (var i = 0; i < $scope.zones.length; i++) {

                        if ($scope.zones[i].zone_cd === id) {
                            index = i;
                            break;
                        }
                    }
                    if (index === -1) {

                        notify({
                            message: "Something gone wrong!",
                            classes: 'alert-danger',
                            position: 'center',
                            duration: 2000
                        });

                    } else {

                        notify({
                            message: "Deleted successfully!",
                            classes: 'alert-success',
                            position: 'center',
                            duration: 2000
                        });

                    }

                    $scope.zones.splice(index, 1);

                } else {

                    notify({
                        message: "Something gone wrong!",
                        classes: 'alert-danger',
                        position: 'center',
                        duration: 2000
                    });

                }

            });

        };

    }

    /**
     * @description zone modal controller
     * @method modalZoneController
     * @param {object} $scope
     * @param {object} $uibModal
     */
    function modalZoneController($scope, $uibModal) {

        $scope.animationsEnabled = true;

        /**
         * @description open modal
         * @method open
         * @param {string} size model's size keep empty for default size
         * @param {string} tpl template name
         */
        $scope.open = function (size, tpl, zone) {

            var uibModalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: tpl,
                controller: 'ModalInstanceCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    zones: function () {
                        return $scope.zones;
                    },
                    zone: function () {
                        return zone;
                    }
                }
            });
        };

    }

    /**
     * @description save zone event and cancel event to dismiss the modal
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $uibModalInstance
     * @param {object} zone
     * @param {service} RequestService
     * @param {array} zones
     * @param {object} session
     * @param {object} notify
     */
    function modalInstanceController($scope, $uibModalInstance, zone, RequestService, zones, session, notify) {

        $scope.zones = zones;
        $scope.zone = zone;

        $scope.ok = function () {

            if (zone == undefined) {

                if (angular.element('#zone_name').val() == "" || angular.element('#zone_address').val() == "" || angular.element('#zone_range').val() == "" || angular.element('#zone_latitude').val() == "" || angular.element('#zone_longitude').val() == "") {
                    alert('all information are required');
                } else {

                    var params = {
                        "zone_name": angular.element('#zone_name').val(),
                        "zone_address": angular.element('#zone_address').val(),
                        "zone_range": angular.element('#zone_range').val(),
                        "zone_latitude": angular.element('#zone_latitude').val(),
                        "zone_longitude": angular.element('#zone_longitude').val(),
                        "cmp_cd": session.getUser().user.cmp_cd
                    }

                    RequestService.postJsonRequest('zone/createZone', params).then(function (data) {
                        if (data.result == undefined) {
                            notify({
                                message: "Created Successfully!",
                                classes: 'alert-success',
                                position: 'center',
                                duration: 2000
                            });
                            $scope.zones.push(data);
                        } else {
                            notify({
                                message: "Something gone wrong!",
                                classes: 'alert-danger',
                                position: 'center',
                                duration: 2000
                            });
                        }


                    });

                    $uibModalInstance.close();
                }


            } else {


                var params = $scope.zone;
                params.cmp_cd = params.company

                RequestService.postJsonRequest('zone/updateZone', params).then(function (data) {

                    if (data.result == undefined) {
                        notify({
                            message: "Updated Successfully!",
                            classes: 'alert-success',
                            position: 'center',
                            duration: 2000
                        });
                    } else {
                        notify({
                            message: "Something gone wrong!",
                            classes: 'alert-danger',
                            position: 'center',
                            duration: 2000
                        });
                    }

                });

                $uibModalInstance.close();
            }


        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    /**
     * @description load location and geocode address
     * @method geocodeController
     * @param {object} $scope
     */
    function geocodeController($scope) {


        $scope.whoiswhere = [];


        /**
         * @description set the latitude and longitude to load map first time
         * @method gotoLocation
         * @param {string} lat
         * @param {string} lon
         * @param {integer} range
         */
        $scope.gotoLocation = function (lat, lon, range) {

            // set new geometry location
            $scope.loc = {lat: lat, lon: lon};
            $scope.whoiswhere = [
                {"name": "My Marker", "lat": lat, "lon": lon, "range": range},
            ];
            // $$phase is used for safe $apply implementation
            if (!$scope.$$phase) {
                // async function when async event occurs
                $scope.$apply(function () {
                    $scope.zone.zone_latitude = lat;
                    $scope.zone.zone_longitude = lon;
                });
            }

        };

        /**
         * @description translate physical address to latitude and longitude
         * @param {string} address
         * @method geoCode
         */
        $scope.geoCode = function (address, range) {

            // check if address not empty
            if (address && address.length > 0) {
                // initiate geocoder
                if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
                // geocode address
                this.geocoder.geocode({'address': address}, function (results, status) {
                    // if address geocoded
                    if (status == google.maps.GeocoderStatus.OK) {
                        var loc = results[0].geometry.location;
                        address = results[0].formatted_address;
                        // move map to new location
                        $scope.gotoLocation(loc.lat(), loc.lng(), range);
                    } else {
                        // alert
                        alert("Sorry, this search produced no results.");
                    }
                });
            }
        };

    }

})();
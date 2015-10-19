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
    function zoneController($scope, ZoneService) {


        ZoneService.getZone(function(data){
            $scope.zones = data;
        })


        /**
         * @description delete row from zone table
         * @method removeZoneRow
         * @param {int} id
         */
        $scope.removeZoneRow = function (id) {
            var index = -1;
            for (var i = 0; i < $scope.zones.length; i++) {
                if ($scope.zones[i]._id === id) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                alert("Something gone wrong");
            }

            $scope.zones.splice(index, 1);
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
        $scope.open = function (size, tpl) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: tpl,
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    zones: function () {
                        return $scope.zones;
                    }
                }
            });
        };
    }

    /**
     * @description ok and cancel buttons to dismiss modal
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $modalInstance
     */
    function modalInstanceController($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }

    /**
     * @description load in location and geocode address
     * @method geocodeController
     * @param {object} $scope
     */
    function geocodeController($scope){

        /**
         * @description set the latitude and longitude to load map first time
         * @method gotoLocation
         * @param {string} lat
         * @param {string} lon
         */
        $scope.gotoLocation = function (lat, lon) {
            if ($scope.lat != lat || $scope.lon != lon) {
                $scope.loc = { lat: lat, lon: lon };
                if (!$scope.$$phase) $scope.$apply("loc");
            }
        };

        $scope.geocodeAddress = "";

        /**
         * @description translate physical address to latitude and longitude
         * @method geoCode
         */
        $scope.geoCode = function () {
            // check if address not empty
            if ($scope.geocodeAddress && $scope.geocodeAddress.length > 0) {
                // initiate geocoder
                if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
                // geocode address
                this.geocoder.geocode({ 'address': $scope.geocodeAddress }, function (results, status) {
                    // if address geocoded
                    if (status == google.maps.GeocoderStatus.OK) {
                        var loc = results[0].geometry.location;
                        $scope.geocodeAddress = results[0].formatted_address;
                        // move map to new location
                        $scope.gotoLocation(loc.lat(), loc.lng());
                    } else {
                        // alert
                        alert("Sorry, this search produced no results.");
                    }
                });
            }
        };

    }

})();
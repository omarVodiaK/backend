(function () {
    'use strict';

    /**
     * module app.beacon
     * @module app.beacon
     * @inject {} hSweetAlert
     * @inject {module} app.zone
     */

    angular
        .module('app.beacon', ['hSweetAlert', 'app.zone'])
        .controller('BeaconCtrl', beaconController)
        .controller('ModalBeaconCtrl', modalController)
        .controller('ModalBeaconInstanceCtrl', modalInstanceController)
        .controller('BeaconAlertCtrl', alertController)

    /**
     *
     * @method beaconController
     * @param {object} $scope
     * @param {service} BeaconService
     */
    function beaconController($scope, BeaconService, ZoneService) {
        $scope.zones = [];

        BeaconService.getBeacon(function (data) {
            $scope.beacons = data;
        });

        ZoneService.getZone(function (data) {
            $scope.zones = data;
        })


        $scope.getZoneName = function (id) {
            var data = $scope.zones;
            for (var i = 0; i < data.length; i++) {
                if (data[i]._id == id) {
                    return data[i].zone_name;
                }
            }
        }


        /**
         * @description delete row from zone table
         * @method removeZoneRow
         * @param {int} id
         */
        $scope.removeBeaconRow = function (id) {
            var index = -1;
            for (var i = 0; i < $scope.beacons.length; i++) {
                if ($scope.beacons[i]._id === id) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                alert("Something gone wrong");
            }
            $scope.beacons.splice(index, 1);
        };

    }

    /**
     * modal controller
     * @method modalController
     * @param {object} $scope
     * @param {object} $uibModal
     */
    function modalController($scope, $uibModal) {
        $scope.animationsEnabled = true;

        /**
         * open modal
         * @method open
         * @param {string} size size of modal, leave empty for default size
         * @param {string} tpl name of the template
         */
        $scope.open = function (size, tpl, beacon) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: tpl,
                controller: 'ModalBeaconInstanceCtrl',
                size: size,
                resolve: {
                    beacons: function () {
                        return $scope.beacons;
                    },
                    beacon: function () {
                        return beacon;
                    }
                }
            });
        };
    }

    /**
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $modalInstance
     * @param {object} beacon
     */
    function modalInstanceController($scope, $modalInstance, beacon) {

        $scope.beacon = beacon;

        /**
         * press ok in modal
         * @method ok
         */
        $scope.ok = function () {
            $modalInstance.close();
        };

        /**
         * cancel modal
         * @method cancel
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }

    /**
     * Description
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $modalInstance
     */
    function alertController($scope, sweet) {

        $scope.confirmCancel = function (state) {
            if (state == 'false') {
                sweet.show({
                    title: 'Confirm',
                    text: 'Share this Beacon?',
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#03A9F4',
                    confirmButtonText: 'Yes, share it!',
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        sweet.show('Shared!', 'The beacon is now visible to associates.', 'success');
                    } else {
                        sweet.show('Cancelled', '', 'error');
                    }
                });
            } else {
                sweet.show({
                    title: 'Confirm',
                    text: 'Unshare this Beacon?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#D32F2F',
                    confirmButtonText: 'Yes, Unshare it!',
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        sweet.show('Unshared!', 'The beacon is not visible anymore.', 'success');
                    } else {
                        sweet.show('Cancelled', '', 'error');
                    }
                });
            }
        };
    }
})();


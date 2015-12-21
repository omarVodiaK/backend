(function () {
    'use strict';

    /**
     * module app.beacon
     * @module app.beacon
     * @inject {} hSweetAlert
     * @inject {module} app.zone
     */

    angular
        .module('app.beacon', ['hSweetAlert', 'app.zone', 'app.location', 'ngFileUpload'])
        .controller('BeaconCtrl', beaconController)
        .controller('ModalBeaconCtrl', modalController)
        .controller('ModalBeaconInstanceCtrl', modalInstanceController)
        .controller('BeaconAlertCtrl', alertController)
        .controller('UploadCtrl', UploadController)

    /**
     * @description initialize beacons, zones, locations controller is called when the beacon page is loaded
     * @method beaconController
     * @param {object} $scope
     * @param {service} BeaconService
     * @param {service} LocationService
     */
    function beaconController($scope, BeaconService, ZoneService, LocationService) {
        $scope.zones = [];
        $scope.locations = [];
        $scope.fakeLocations = [];
        var idExist = false;

        BeaconService.getBeacon(function (data) {
            $scope.beacons = data;
        });

        ZoneService.getZone(function (data) {
            $scope.zones = data;
        })

        LocationService.getLocation(function (data) {

            var parsed = JSON.parse(JSON.stringify(data), function (k, v) {
                if (k === "loc_name")
                    this.label = v;
                else if (k === "loc_description")
                    this.description = v;
                else if (k === "locations") {
                    this.children = v;
                    this.onSelect = function (branch) {
                        $scope.output = branch;
                    };
                } else {
                    this.onSelect = function (branch) {
                        $scope.output = branch;
                    };
                    return v;
                }
                for (var i = 0; i < $scope.fakeLocations.length; i++) {
                    if (this._id == $scope.fakeLocations[i]._id) {
                        idExist = true;
                    }
                }
                if (!idExist) {
                    $scope.fakeLocations.push(this);
                }
                idExist = false;
                $scope.locations = $scope.fakeLocations;
            });

        })

        $scope.getLocationName = function (id) {

            var data = $scope.locations;
            for (var i = 0; i < data.length; i++) {

                if (data[i]._id == id) {
                    return data[i].label;
                }
            }
        }

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
     * @description open modal controller
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
            var uibModalInstance = $uibModal.open({
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
     * @description handle events cancel and save
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $modalInstance
     * @param {object} beacon
     */
    function modalInstanceController($scope, $uibModalInstance, beacon) {

        $scope.beacon = beacon;

        /**
         * press ok in modal
         * @method ok
         */
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        /**
         * cancel modal
         * @method cancel
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    /**
     * To avoid deleting a record by mistake
     * @method alertController
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

    /**
     * @description upload image controller
     * @method UploadController
     * @param {object} $scope
     * @param {object} Upload
     * @param {object} $timeout
     */
    function UploadController($scope, Upload, $timeout) {

        $scope.uploadPic = function (file) {
            file.upload = Upload.upload({
                url: 'http://localhost:3507/upload.html',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    }

})();


(function () {


    'use strict';

    /**
     * module app.beacon
     * @module app.beacon
     * @inject {} hSweetAlert
     * @inject {module} app.zone
     */

    angular
        .module('app.beacon', ['ngFileUpload'])

        .controller('BeaconCtrl', beaconController)
        .controller('ModalBeaconCtrl', modalController)
        .controller('ModalBeaconInstanceCtrl', modalInstanceController)
        .controller('BeaconAlertCtrl', alertController)
        .controller('UploadCtrl', UploadController)

    /**
     * @description initialize beacons, zones, locations controller is called when the beacon page is loaded
     * @method beaconController
     * @param {object} $scope
     * @param {object} $rootScope
     * @param {service} RequestService
     */
    function beaconController($scope, RequestService, $rootScope) {
        $scope.zones = [];
        $scope.locations = [];
        $scope.fakeLocations = [];
        var idExist = false;

        var params = {
            'cmp_cd': $rootScope.company
        }

        RequestService.postJsonRequest('beacon/findBeaconByCompanyId', params).then(function (data) {

            if (data.result == "this model doesn't exist") {


            } else {
                $scope.beacons = data;
            }

        });

        RequestService.postJsonRequest('zone/findZoneByCompanyId', params).then(function (data) {
            $scope.zones = data;
        });

        RequestService.postJsonRequest('location/getLocationsByCompanyId', params).then(function (data) {

            $scope.locations = JSON.parse(JSON.stringify(data), function (k, v) {

                if (k === "loc_name")
                    this.label = v;
                else if (k === "loc_description")
                    this.description = v;
                else if (k === "locations") {

                    this.children = v;
                    this.onSelect = function (branch) {
                        $scope.output = branch
                    };

                } else {

                    this.onSelect = function (branch) {
                        $scope.output = branch
                    };

                    return v;
                }
                for (var i = 0; i < $scope.fakeLocations.length; i++) {

                    if (this.loc_cd == $scope.fakeLocations[i].loc_cd) {
                        idExist = true;
                    }

                }
                if (!idExist) {

                    $scope.fakeLocations.push(this);

                }
                idExist = false;

            });


        });


        /**
         * @description delete row from zone table
         * @method removeZoneRow
         * @param {int} id
         */
        $scope.removeBeaconRow = function (id) {

            var identifier = {
                "bcn_cd": id
            };

            RequestService.postJsonRequest('beacon/deleteBeacon', identifier).then(function (data) {

                if (data.result == "deleted successfully") {

                    var index = -1;

                    for (var i = 0; i < $scope.beacons.length; i++) {
                        if ($scope.beacons[i].bcn_cd === id) {
                            index = i;
                            break;
                        }
                    }

                    if (index === -1) {
                        alert("Something gone wrong");
                    }

                    $scope.beacons.splice(index, 1);

                } else {

                    alert("Something gone wrong");

                }

            });

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

            $scope.beacon = beacon;

            var uibModalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: tpl,
                controller: 'ModalBeaconInstanceCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    beacons: function () {
                        return $scope.beacons;
                    },
                    beacon: function () {
                        return $scope.beacon;
                    }
                }
            });
        };
    }

    /**
     * @description handle events cancel and save
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $uibModalInstance
     * @param {object} beacon
     * @param {object} beacons
     * @param {service} RequestService
     */
    function modalInstanceController($scope, $uibModalInstance, beacon, beacons, RequestService) {

        $scope.beacon = beacon;
        $scope.beacons = beacons;


        /**
         * press ok in modal
         * @method ok
         */
        $scope.ok = function () {

            if (beacon == undefined) {
                if (angular.element('#beacon_name').val() == "" || angular.element('#beacon_uuid').val() == "" || angular.element('#beacon_major').val() == "" || angular.element('#beacon_minor').val() == "" || angular.element('#beacon_general_info').val() == "") {

                    alert('All information are required');

                } else {
                    var params = {
                        "bcn_name": angular.element('#beacon_name').val(),
                        "bcn_uuid": angular.element('#beacon_uuid').val(),
                        "bcn_major": angular.element('#beacon_major').val(),
                        "bcn_minor": angular.element('#beacon_minor').val(),
                        "zone_cd": angular.element('#beacon_zone').val(),
                        "bcn_shared": false,
                        "loc_cd": "loc_7",
                        "bcn_general_info": angular.element('#beacon_general_info').val(),
                        "cmp_cd": $rootScope.company
                    }

                    RequestService.postJsonRequest('beacon/createBeacon', params).then(function (data) {

                        if (data[0].bcn_name == angular.element('#beacon_name').val()) {
                            $scope.beacons.push(data[0]);
                            $uibModalInstance.close();
                        }

                    });


                }
            } else {

                var params = $scope.beacon;
                params.cmp_cd = params.company;
                params.loc_cd = params.location.loc_cd;
                params.zone_cd = params.zone.zone_cd;


                RequestService.postJsonRequest('beacon/updateBeacon', params).then(function (data) {

                    for (var i = 0; i < $scope.beacons.length; i++) {
                        if (data.bcn_cd == $scope.beacons[i].bcn_cd) {
                            $scope.beacons[i] = data;
                        }
                    }

                    $uibModalInstance.close();


                });

            }

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
     * @param {object} sweet
     * @param {service} RequestService
     */
    function alertController($scope, sweet, RequestService) {

        $scope.confirmCancel = function (state, id) {


            if (state == false) {
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

                        var params = {
                            bcn_cd: id,
                            bcn_shared: true
                        };

                        RequestService.postJsonRequest('beacon/shareBeacon', params).then(function (data) {

                            if (data.bcn_shared == true) {

                                for (var i = 0; i < $scope.beacons.length; i++) {

                                    if (data.bcn_cd == $scope.beacons[i].bcn_cd) {
                                        $scope.beacons[i] = data;
                                    }

                                }

                                sweet.show('Shared!', 'The beacon is now visible to associates.', 'success');

                            } else {

                                sweet.show('Cancelled', '', 'error');

                            }


                        });

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

                        var params = {
                            bcn_cd: id,
                            bcn_shared: false
                        };

                        RequestService.postJsonRequest('beacon/shareBeacon', params).then(function (data) {

                            if (data.bcn_shared == false) {

                                for (var i = 0; i < $scope.beacons.length; i++) {

                                    if (data.bcn_cd == $scope.beacons[i].bcn_cd) {
                                        $scope.beacons[i] = data;
                                    }

                                }

                                sweet.show('Unshared!', 'The beacon is not visible anymore.', 'success');

                            } else {

                                sweet.show('Cancelled', '', 'error');

                            }
                        });


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


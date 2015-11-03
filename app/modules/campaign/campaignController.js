(function () {
    'use strict';

    /**
     * module app.campaign
     * @module app.campaign
     */

    angular
        .module('app.campaign', ['hSweetAlert', 'ui.bootstrap', 'app.category', 'app.zone', 'app.content', 'toastr', 'oi.select'])
        .controller('CampaignCtrl', campaignController)
        .controller('ModalCampaignCtrl', modalController)
        .controller('ModalCampaignInstanceCtrl', modalInstanceController)
        .controller('CampaignStepCtrl', campaignStepController)
        .controller('CampaignAlertCtrl', alertController)
        .controller('GenderMultiSelectCtrl', multiSelectController)
        .controller('PopulateFrequencyCtrl', populateFrequencyController)


    function campaignController($scope, CampaignService) {

        CampaignService.getCampaign(function (data) {
            $scope.campaigns = data;
        });

        CampaignService.getBeaconsInCampaign(function (data) {
            $scope.beaconsInCampaign = data;
        })

        $scope.removeCampaignRow = function (id) {
            var index = -1;
            var arrCampaigns = $scope.campaigns;
            for (var i = 0; i < arrCampaigns.length; i++) {
                if (arrCampaigns[i]._id === id) {
                    index = i;
                    break;
                }
            }
            /**
             *  === is to check if the value and the type are equal
             */
            if (index === -1) {
                alert("Something gone wrong");
            }

            $scope.campaigns.splice(index, 1);
        };
    }

    function campaignStepController($scope, CampaignService, ZoneService, BeaconService, ContentService, toastr) {

        $scope.categories = [];
        $scope.zones = [];
        $scope.contentTypes = [];
        $scope.step = 1;
        var arrCategories = [];
        var isChecked = false;

        CampaignService.getBeaconsInCampaign(function (data) {
            $scope.beaconInCampaign = data;
        })

        CampaignService.getContentInBeacon(function (data) {
            $scope.contentInBeacon = data;
        })

        ContentService.getContent(function (data) {
            $scope.content = data;
        })

        ContentService.getContentTypes(function (data) {
            $scope.contentTypes = data;
        });

        selectBeacons();

        //$scope.check = function (value) {
        //    if (arrCategories.length > 0) {
        //        var isTrue = true;
        //        for (var i = 0; i < arrCategories.length; i++) {
        //            if (arrCategories[i]._id == value._id) {
        //                arrCategories.splice(i, 1);
        //                isTrue = false;
        //                break;
        //            }
        //        }
        //        if (isTrue) {
        //            arrCategories.push(value);
        //        }
        //    } else {
        //        arrCategories.push(value);
        //    }
        //}
        //
        //$scope.nextStep = function () {
        //    if (arrCategories.length == 0) {
        //        toastController(toastr);
        //    } else {
        //        $scope.step++;
        //        if ($scope.step == 2) {
        //            selectZones();
        //        } else if ($scope.step == 3) {
        //            selectBeacons();
        //        }
        //    }
        //}
        //
        //$scope.saveCampaign = function () {
        //    // submit code goes here
        //}

        function selectZones() {
            ZoneService.getZone(function (data) {
                $scope.zones = [];
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < arrCategories.length; j++) {
                        if (arrCategories[j]._id == data[i].cat_id) {
                            $scope.zones.push(data[i]);
                        }
                    }
                }
            });
        }

        /*
         * select all the beacons
         * */

        function selectBeacons() {
            BeaconService.getBeacon(function (data) {

                $scope.beacons = [];
                for (var i = 0; i < data.length; i++) {
                    $scope.beacons.push(data[i]);
                }
            });
        }

        $scope.nextStep = function () {
            $scope.step++;
        }

        $scope.prevStep = function () {
            $scope.step--;
        }

        $scope.submitForm = function () {
            // submit code goes here
        }

        $scope.getContentTypeName = function (id) {
            var data = $scope.contentTypes;
            for (var i = 0; i < data.length; i++) {
                if (data[i]._id == id) {
                    var result = data[i].cht_category + " " + data[i].cht_name + " " + data[i].cht_value;
                    return result;
                }
            }
        }

        $scope.getContent = function (id) {

            var arrBeaconInCampaign = [];
            var arrContentInBeacon = [];
            $scope.contents = [];


            for (var i = 0; i < $scope.beaconInCampaign.length; i++) {

                if (id == $scope.beaconInCampaign[i].chb_bcn_id) {
                    arrBeaconInCampaign.push($scope.beaconInCampaign[i]);
                }
            }

            for (var i = 0; i < $scope.contentInBeacon.length; i++) {
                for (var j = 0; j < arrBeaconInCampaign.length; j++) {
                    if (arrBeaconInCampaign[j]._id == $scope.contentInBeacon[i].chbc_chb_id) {
                        arrContentInBeacon.push($scope.contentInBeacon[i]);
                    }
                }
            }

            for (var i = 0; i < arrContentInBeacon.length; i++) {
                for (var j = 0; j < $scope.content.length; j++) {
                    if (arrContentInBeacon[i].chbc_cnt_id == $scope.content[j]._id) {
                        $scope.contents.push($scope.content[j]);
                    }
                }
            }
        }

    }

    /**
     * Description
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $modalInstance
     */
    function alertController($scope, sweet) {

        $scope.confirmCancel = function (state) {
            if (state == 'archive') {
                sweet.show({
                    title: 'Confirm',
                    text: 'Activate this campaign?',
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#03A9F4',
                    confirmButtonText: 'Yes, activate it!',
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        sweet.show('Activated!', 'The campaign is currently used.', 'success');
                    } else {
                        sweet.show('Cancelled', '', 'error');
                    }
                });
            } else if (state == 'activated') {
                sweet.show({
                    title: 'Confirm',
                    text: 'Deactivate this campaign?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#D32F2F',
                    confirmButtonText: 'Yes, Deactivate it!',
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        sweet.show('Deactivated!', 'The campaign are not visible anymore.', 'success');
                    } else {
                        sweet.show('Cancelled', '', 'error');
                    }
                });
            }
        };
    }

    function toastController(toastr) {

        toastr.warning('Categories are required', 'Please select a category!', {
            extendedTimeOut: 1000,
            closeButton: true
        });


    }

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
                controller: 'ModalCampaignInstanceCtrl',
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

    function multiSelectController($scope) {

        $scope.arrGender = [
            {
                "id": 1,
                "name": "male"
            }, {
                "id": 2,
                "name": "female"
            }
        ];

        $scope.arrInteractWith = [
            {
                "id": 1,
                "name": "Malay"
            }, {
                "id": 2,
                "name": "Indian"
            },
            {
                "id": 3,
                "name": "Chinese"
            },
            {
                "id": 4,
                "name": "Expatriate"
            }

        ];
    }

    function populateFrequencyController($scope) {

        $scope.makeChanged = function (value) {
            if (value.name == "Day") {
                $scope.min = 1;
                $scope.max = 6;
            } else if (value.name == "Hour") {
                $scope.min = 1;
                $scope.max = 23;
            } else if (value.name == "Week") {
                $scope.min = 1;
                $scope.max = 3;
            } else if (value.name == "Month") {
                $scope.min = 1;
                $scope.max = 11;
            } else if (value.name == "Year") {
                $scope.min = 1;
                $scope.max = 1;
            } else {
                $scope.min = 0;
                $scope.max = '';
            }

        }
        $scope.frequecyItems = [
            {
                id: 1,
                name: 'Hour'
            },
            {
                id: 2,
                name: 'Day'
            },
            {
                id: 3,
                name: 'Week'
            },
            {
                id: 4,
                name: 'Month'
            },
            {
                id: 5,
                name: 'Year'
            },
            {
                id: 6,
                name: 'none'
            }
        ];


    }

})();
(function () {
    'use strict';

    /**
     * module app.campaign
     * @module app.campaign
     */

    angular
        .module('app.campaign', ['app.zone', 'app.content', 'app.associate', 'app.login', 'app.beacon'])

        .controller('CampaignCtrl', campaignController)
        .controller('PublishCampaignModal', publishModalController)
        .controller('ModalCampaignCtrl', modalController)
        .controller('ModalCampaignInstanceCtrl', modalInstanceController)
        .controller('CampaignStepCtrl', campaignStepController)
        .controller('CampaignAlertCtrl', alertController)
        .controller('GenderMultiSelectCtrl', multiSelectController)
        .controller('PopulateFrequencyCtrl', populateFrequencyController)
        .controller('DatePickerCtrl', datePickerController)
        .controller('TimePickerCtrl', timePickerController)
        .controller('CampaignBadgeCtrl', campaignBadgeController)
        .controller('UpdateCampaignCtrl', updateCampaignController)
        .controller('RedeemCtrl', redeemController)

    function campaignController($scope, CampaignService, ShareData) {

        CampaignService.getCampaign(function (data) {
            $scope.campaigns = data;
        });

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

        $scope.updateCampaign = function (campaign) {

            // save
            ShareData.addData(campaign);

            window.location.href = "#/dashboard/new-campaign"
        }

    }

    function updateCampaignController($scope, ShareData, BeaconService) {

        $scope.newArray = [];

        /**
         * getBeacons is a service in app.beacon module
         */
        var promise = BeaconService.getListOfBeacons();

        var campaign = ShareData.getData();

        if (campaign[0] !== undefined) {
            $scope.campaign = campaign[0];
        }

        ShareData.clearData();


        promise.then(function (r) {

            $scope.beacons = r.data
            var hasRecord = false;

            if ($scope.campaign) {

                for (var i = 0; i < $scope.beacons.length; i++) {

                    if ($scope.campaign.beacons) {

                        for (var j = 0; j < $scope.campaign.beacons.length; j++) {

                            if ($scope.campaign.beacons[j].redeem.length > 0) {
                                for (var x = 0; x < $scope.campaign.beacons[j].redeem.length; x++) {
                                    if ($scope.campaign.beacons[j].redeem[x].brb_chb_id_redeemer == $scope.beacons[i]._id) {
                                        $scope.campaign.beacons[j].redeem[x] = merge($scope.campaign.beacons[j].redeem[x], $scope.beacons[i]);
                                    }
                                }
                            }

                            if ($scope.campaign.beacons[j].chb_bcn_id == $scope.beacons[i]._id) {

                                $scope.newArray.push(merge($scope.campaign.beacons[j], $scope.beacons[i]));

                            }
                        }

                    } else {

                        if ($scope.campaign.cmp_id == $scope.beacons[i].bcn_cmp_id) {

                            $scope.beacons[i].chb_type = "internal";

                        } else {
                            $scope.beacons[i].chb_type = "external";
                        }
                        $scope.newArray.push($scope.beacons[i]);

                    }

                }

            }


            for (var i = 0; i < $scope.newArray.length; i++) {

                for (var j = 0; j < $scope.beacons.length; j++) {

                    if ($scope.newArray[i]._id == $scope.beacons[j]._id) {

                        hasRecord = true;

                    }

                    if (j == $scope.newArray.length - 1) {

                        if (!hasRecord) {

                            $scope.beacons[j].bcn_used = "false";

                            if ($scope.campaign.cmp_id == $scope.beacons[j].bcn_cmp_id) {

                                $scope.beacons[j].chb_type = "internal";

                            } else {
                                $scope.beacons[j].chb_type = "external";
                            }

                            $scope.newArray.push($scope.beacons[j])

                        }

                        hasRecord = false;

                    }
                }

            }


        });


    }

    function campaignStepController($scope, ZoneService, ContentService) {

        $scope.step = 1;
        $scope.zones = [];
        $scope.contentTypes = [];
        $scope.contents = [];


        ContentService.getContent(function (data) {
            $scope.content = data;
        });

        ContentService.getContentTypes(function (data) {
            $scope.contentTypes = data;
        });

        ZoneService.getZone(function (data) {
            $scope.zones = data;
        });

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

    }

    /**
     * @description alert controller after triggering delete event
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} sweet hSweetAlert dependencies
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

    function redeemController($scope, BeaconService) {
        var redeemers = [];
        $scope.redeemers = [];
        $scope.beacons = [];


        var promise = BeaconService.getListOfBeacons();

        promise.then(function (r) {

            $scope.beacons = r.data


            if ($scope.campaign) {

                if ($scope.campaign.beacons) {

                    for (var i = 0; i < $scope.campaign.beacons.length; i++) {

                        if ($scope.campaign.beacons[i].bcn_interaction_type == "fetch") {

                            redeemers.push($scope.campaign.beacons[i]);
                        }
                    }

                    for (var i = 0; i < $scope.campaign.beacons.length; i++) {

                        for (var j = 0; j < redeemers.length; j++) {

                            if ($scope.campaign.beacons[i].chb_bcn_id == redeemers[j].chb_bcn_id) {

                                for (var x = 0; x < $scope.beacons.length; x++) {
                                    if ($scope.beacons[x]._id == $scope.campaign.beacons[i].chb_bcn_id) {
                                        $scope.redeemers.push(merge($scope.beacons[x], $scope.campaign.beacons[i]));
                                    }
                                }

                            }
                        }

                    }
                }
            }

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
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    beacons: function () {
                        return $scope.beacons;
                    },
                    beacon: function () {
                        return beacon;
                    },
                    associates: function () {
                        return '';
                    },
                    campaign: function () {
                        return $scope.campaign;
                    }
                }
            });

        };


    }

    function publishModalController($scope, $uibModal, AssociateService, LoginService) {

        $scope.associates = [];
        $scope.animationsEnabled = true;

        /**
         * getUsers is a service in app.login module
         */
        var promise = LoginService.getListOfUsers();

        promise.then(function (result) {

            AssociateService.getAssociate(function (data2) {
                for (var i = 0; i < data2.length; i++) {
                    for (var j = 0; j < result.data.length; j++) {
                        if (data2[i].cmp_id == result.data[j]._id) {
                            $scope.associates.push(result.data[j]);
                        }
                    }
                }
            });

        });

        /**
         * open modal while providing a model that will be displayed on the respective form
         * @method open
         * @param {string} size size of modal, leave empty for default size
         * @param {string} tpl name of the template
         * @param {object} beacon
         */
        $scope.openModal = function (size, tpl, associates, campaign) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: tpl,
                controller: 'ModalCampaignInstanceCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    associates: function () {
                        return associates;
                    },
                    campaign: function () {

                        return campaign;
                    },
                    beacon: function () {
                        return '';
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
    function modalInstanceController($scope, $uibModalInstance, associates, campaign, beacon) {
        $scope.associates = associates;
        $scope.campaign = campaign;
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

        // set the max and min value for input depending on the value chosen
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

    /**
     * @description configuration and event for uib-datepicker
     * @method datePickerController
     * @param {object} $scope
     *
     * */
    function datePickerController($scope) {

        /**
         * @description set default values as current day when uib-datepicker is loaded on DOM
         * @method today
         *
         * */
        $scope.today = function () {
            $scope.dtStart = new Date();
            $scope.dtEnd = new Date();
        };

        $scope.today();

        /**
         * @description function to open uib-datepicker (start date) as popup when its triggered
         * @method openStart
         * @param {object} $event
         *
         * */
        $scope.openStart = function ($event) {
            $scope.statusStart.opened = true;
        };

        /**
         * @description function to open uib-datepicker (end date) as popup when its triggered
         * @method openEnd
         * @param {object} $event
         *
         * */
        $scope.openEnd = function ($event) {
            $scope.statusEnd.opened = true;
        };

        // set options for uib-datepicker
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        // set date format
        $scope.format = 'dd/MM/yyyy';

        $scope.statusStart = {
            opened: false
        };

        $scope.statusEnd = {
            opened: false
        };
    }

    /**
     * @description configuration and event for uib-timepicker
     * @method timePickerController
     * @param {object} $scope
     *
     * */
    function timePickerController($scope) {

        // set default values for uib-timepicker(current time)
        $scope.timeBegin = new Date();
        $scope.timeEnd = new Date();

        // set hour steps
        $scope.hstep = 1;
        // set minute steps
        $scope.mstep = 1;

        // AM, PM choice the format is 12, by setting to false the format will be 24
        $scope.ismeridian = true;

    }

    /**
     * @description app.campaign module controller, it handles the notification part using toastr.
     * @method campaignBadgeController
     * @param {object} $scope
     * @param {service} CampaignService service from app.campaign module
     * @param {object} toastr
     */
    function campaignBadgeController($scope, CampaignService, toastr) {

        CampaignService.getCampaign(function (data) {

            $scope.campaigns = [];
            $scope.publishRequestNumber = 0;
            $scope.campaigns = data;

            for (var i = 0; i < data.length; i++) {

                // check if the request state is pending
                for (var j = 0; j < data[i].published_to.length; j++) {
                    if (data[i].published_to[j].cmp_state == "pending") {
                        $scope.publishRequestNumber++;
                    }
                }

            }

            if ($scope.publishRequestNumber > 0) {

                if ($scope.publishRequestNumber == 1) {

                    toastr.info('You have ' + $scope.publishRequestNumber + ' publish pending request', 'Information');
                } else {
                    toastr.info('You have ' + $scope.publishRequestNumber + ' publish pending requests', 'Information');
                }

            }
        })

    }

    // merge function only json object
    function merge(obj1, obj2) {
        var result = {}; // return result
        for (var i in obj1) {      // for every property in obj1
            if ((i in obj2) && (typeof obj1[i] === "object") && (i !== null)) {
                result[i] = merge(obj1[i], obj2[i]); // if it's an object, merge
            } else {
                result[i] = obj1[i]; // add it to result
            }
        }
        for (i in obj2) { // add the remaining properties from object 2
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj2[i];
        }
        result.bcn_used = "true";
        return result;
    }

})();
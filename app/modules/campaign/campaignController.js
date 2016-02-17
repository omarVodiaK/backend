(function () {
    'use strict';

    /**
     * module app.campaign
     * @module app.campaign
     */

    angular
        .module('app.campaign', ["checklist-model"])

        .controller('CampaignCtrl', campaignController)
        .controller('PublishCampaignModal', publishModalController)
        .controller('ModalCampaignCtrl', modalController)
        .controller('ModalCampaignInstanceCtrl', modalInstanceController)
        .controller('CampaignStepCtrl', campaignStepController)
        .controller('CampaignAlertCtrl', alertController)
        .controller('PopulateFrequencyCtrl', populateFrequencyController)
        .controller('CampaignBadgeCtrl', campaignBadgeController)
        .controller('UpdateCampaignCtrl', updateCampaignController)
        .controller('RedeemCtrl', redeemController)
        .controller('trueOwnerCtrl', ownerController)


    function ownerController($scope, $rootScope, RequestService) {

    }


    function campaignController($scope, RequestService, ShareData, $rootScope) {


        RequestService.postJsonRequest('campaign/findCampaignByCompanyId', {'cmp_cd': $rootScope.company}).then(function (result) {

            if (result.result == "this model doesn't exist" || result.result == 'error') {

            }
            else if (result.result == undefined) {
                $scope.campaigns = result;
                console.log($scope.campaigns)

            }
        });

        $scope.formatDate = function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }

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

    function updateCampaignController($scope, ShareData, RequestService, $rootScope) {


        /**
         * getBeacons is a service in app.beacon module
         */
        var campaign = ShareData.getData();

        if (campaign[0] !== undefined) {
            $scope.campaign = campaign[0];
        } else {
            RequestService.postJsonRequest('campaign/findCampaignBeacons', {'cmp_cd': $rootScope.company}).then(function (beacons) {
                $scope.campaign = {};
                $scope.campaign.beacons = beacons;
                $scope.campaign.beacons = cleanup($scope.campaign.beacons, 'beacon');
            })
        }

        ShareData.clearData();


        $scope.day = [];
        $scope.selectedDays = [];

        $scope.selectedDay = function (id) {
            var selected = false;
            $scope.selectedDays.forEach(function (day) {
                if (day == id) {
                    selected = true;
                    console.log('here')
                    $scope.selectedDays.splice($scope.selectedDays.indexOf(day), 1);
                    console.log($scope.selectedDays);
                }
            })
            if (selected == false) {
                $scope.selectedDays.push(id);
                console.log($scope.selectedDays);
            }

        }

        // watch change on uib-timepicker for time begin
        $scope.timeBeginChanged = function (value) {
            $scope.timeBegin = value;
        };

        // watch change on uib-timepicker for time end
        $scope.timeEndChanged = function (value) {
            $scope.timeEnd = value;
        };


        ////////////////// begin timerpicker controller ///////////////////////////////

        if ($scope.campaign == undefined) {

            //set default values for uib-timepicker(current time)
            $scope.timeBegin = new Date();
            $scope.timeEnd = new Date();
        } else {

            var timeBegin = new Date($scope.campaign.sch_date_start);
            timeBegin.setHours($scope.campaign.sch_time_start.slice(0, 2));
            timeBegin.setMinutes($scope.campaign.sch_time_start.slice(3));

            var timeEnd = new Date($scope.campaign.sch_date_end);
            timeEnd.setHours($scope.campaign.sch_time_end.slice(0, 2));
            timeEnd.setMinutes($scope.campaign.sch_time_end.slice(3));

            $scope.timeBegin = timeBegin;
            $scope.timeEnd = timeEnd;
        }

        // set hour steps
        $scope.hstep = 1;
        // set minute steps
        $scope.mstep = 1;

        // AM, PM choice the format is 12, by setting to false the format will be 24
        $scope.ismeridian = true;
        //////////////////  end timerpicker controller ////////////////////////////////

        $scope.save = function () {

            if ($scope.campaign.owner == undefined || $scope.campaign.owner.camp_cd == undefined) {

                if (angular.element('#campaign_name').val() != '' && angular.element('#campaign_description').val() && angular.element('#campaign_priority').val()) {

                    var campaignParams = {
                        camp_name: angular.element('#campaign_name').val(),
                        camp_description: angular.element('#campaign_description').val(),
                        camp_priority: angular.element('#campaign_priority').val(),
                        camp_state: 'inactive'

                    }


                    RequestService.postJsonRequest('campaign/createCampaign', campaignParams).then(function (createdCampaign) {
                        console.log(createdCampaign);

                        var companyCampaignParams = {
                            cmp_cd: $rootScope.company,
                            camp_cd: createdCampaign.camp_cd,
                            camp_state: 'accepted',
                            cmp_camp_owner: true
                        }

                        RequestService.postJsonRequest('companyCampaign/createCampaignOwner', companyCampaignParams).then(function (result) {

                            var scheduleParams = {
                                sch_date_start: $scope.dtStart,
                                sch_date_end: $scope.dtEnd,
                                sch_time_start: $scope.timeBegin.getHours() + ':' + $scope.timeBegin.getMinutes(),
                                sch_time_end: $scope.timeEnd.getHours() + ':' + $scope.timeEnd.getMinutes(),
                                camp_cd: createdCampaign.camp_cd
                            }

                            RequestService.postJsonRequest('schedule/createSchedule', scheduleParams).then(function (schedule) {
                                console.log(schedule)

                                var campaignNewParams = {
                                    camp_cd: createdCampaign.camp_cd,
                                    camp_name: angular.element('#campaign_name').val(),
                                    camp_description: angular.element('#campaign_description').val(),
                                    camp_priority: angular.element('#campaign_priority').val(),
                                    camp_state: 'inactive',
                                    sch_cd: schedule.sch_cd

                                }

                                $scope.selectedDays.forEach(function (day) {

                                    RequestService.postJsonRequest('scheduleDay/createScheduleDay', {
                                        day_cd: day,
                                        sch_cd: schedule.sch_cd
                                    }).then(function (res) {
                                        console.log(res)
                                    })
                                })

                                RequestService.postJsonRequest('campaign/updateCampaign', campaignNewParams).then(function (updatedCampaign) {
                                    console.log(updatedCampaign)
                                })


                            })
                        })


                    })


                } else {
                    alert('all information are required');
                }


            } else {

                var campaignParams = {
                    camp_cd: $scope.campaign.owner.camp_cd,
                    camp_name: angular.element('#campaign_name').val(),
                    camp_description: angular.element('#campaign_description').val(),
                    camp_priority: angular.element('#campaign_priority').val(),
                    camp_state: 'inactive',
                    sch_cd: $scope.campaign.sch_cd

                }

                RequestService.postJsonRequest('campaign/updateCampaign', campaignParams).then(function (updatedCampaign) {
                    if (!updatedCampaign.result) {
                        console.log($scope.timeBegin.getHours() + ':' + $scope.timeBegin.getMinutes());
                        console.log($scope.timeEnd.getHours() + ':' + $scope.timeEnd.getMinutes());
                        var scheduleParams = {
                            sch_cd: $scope.campaign.sch_cd,
                            sch_date_start: $scope.dtStart,
                            sch_date_end: $scope.dtEnd,
                            sch_time_start: $scope.timeBegin.getHours() + ':' + $scope.timeBegin.getMinutes(),
                            sch_time_end: $scope.timeEnd.getHours() + ':' + $scope.timeEnd.getMinutes(),
                            camp_cd: $scope.campaign.owner.camp_cd

                        }

                        RequestService.postJsonRequest('schedule/updateSchedule', scheduleParams).then(function (updatedSchedule) {
                            if (!updatedSchedule.result) {
                                //console.log(updatedSchedule)

                                updatedSchedule[0].days.forEach(function (updatedSchedule) {
                                    RequestService.postJsonRequest('scheduleDay/deleteScheduleDay', {sch_day_cd: updatedSchedule.sch_day_cd}).then(function (deleteSchedule) {

                                    })


                                })
                                $scope.selectedDays.forEach(function (day) {

                                    RequestService.postJsonRequest('scheduleDay/createScheduleDay', {
                                        day_cd: day,
                                        sch_cd: updatedSchedule[0].sch_cd
                                    }).then(function (res) {
                                        //console.log(res)
                                    })
                                })

                            }
                        })

                    } else {
                        alert("This campaign doesn't exist");
                    }
                })

                console.log('update campaign')
                console.log($scope.campaign)

            }


        }

        $scope.newArray = [];


        ////////////////// begin datepicker controller /////////////////////////////////

        /**
         * @description set default values as current day when uib-datepicker is loaded on DOM
         * @method today
         *
         * */
        if ($scope.campaign == undefined) {
            $scope.today = function () {
                $scope.dtStart = new Date();
                $scope.dtEnd = new Date();
            };
            $scope.today();
        } else {
            $scope.today = function () {
                $scope.dtStart = new Date($scope.campaign.sch_date_start);
                $scope.dtEnd = new Date($scope.campaign.sch_date_end);
            };
            $scope.today();
        }


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

        if ($scope.campaign) {
            $scope.campaign.days.forEach(function (day) {
                $scope.day.push(day.day_cd.day_cd)
                $scope.selectedDays.push(day.day_cd.day_cd)
            })

            $scope.days = {
                day: $scope.day
            }
        }

        ///////////////// end datepicker controller   //////////////////////////////////

    }

    function campaignStepController($scope, ZoneService, ContentService, RequestService, $rootScope) {

        $scope.step = 1;
        $scope.zones = [];
        $scope.contentTypes = [];
        $scope.contents = [];

        if ($scope.campaign) {
            RequestService.postJsonRequest('campaign/findCampaignBeacons', {'cmp_cd': $rootScope.company}).then(function (beacons) {
                if ($scope.campaign.beacons) {
                    $scope.campaign.beacons.forEach(function (campBeacon) {

                        beacons.forEach(function (beacon) {
                            $scope.campaign.beacons.push(beacon)
                        })

                    });

                    $scope.campaign.beacons = cleanup($scope.campaign.beacons, 'beacon');
                } else {
                    $scope.campaign.beacons = beacons;
                    $scope.campaign.beacons = cleanup($scope.campaign.beacons, 'beacon');
                }

                console.log($scope.campaign)
            })

        }

        else {
            $scope.campaign = [];

            RequestService.postJsonRequest('campaign/findCampaignBeacons', {'cmp_cd': $rootScope.company}).then(function (beacons) {
                $scope.campaign.beacons = beacons

            })
        }

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

    function cleanup(arr, prop) {
        var new_arr = [];
        var lookup = {};

        for (var i in arr) {

            if (lookup[arr[i][prop].bcn_cd]) {

            } else {
                lookup[arr[i][prop].bcn_cd] = arr[i];
            }

        }

        for (i in lookup) {

            new_arr.push(lookup[i]);
        }

        return new_arr;
    }

    /**
     * @description alert controller after triggering delete event
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} sweet hSweetAlert dependencies
     */
    function alertController($scope, sweet, RequestService) {

        $scope.confirmCancel = function (campaign) {
            $scope.campaign = campaign;

            if ($scope.campaign.owner.camp_state == 'inactive' || $scope.campaign.owner.camp_state == 'expired') {
                var campaignParams = {
                    camp_cd: $scope.campaign.owner.camp_cd,
                    camp_name: $scope.campaign.owner.camp_name,
                    camp_description: $scope.campaign.owner.camp_description,
                    camp_priority: $scope.campaign.owner.camp_priority,
                    camp_state: 'active',
                    sch_cd: $scope.campaign.owner.schedule
                }
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
                        RequestService.postJsonRequest('campaign/updateCampaign', campaignParams).then(function (updateCampaign) {
                            if (!updateCampaign.result) {
                                $scope.campaign.owner.camp_state = 'active';
                                sweet.show('Activated!', 'The campaign is currently used.', 'success');
                            } else {
                                sweet.show('Cancelled', '', 'error');
                            }
                        })

                    } else {
                        sweet.show('Cancelled', '', 'error');
                    }
                });
            } else if (campaign.owner.camp_state == 'active') {

                var campaignParams = {
                    camp_cd: $scope.campaign.owner.camp_cd,
                    camp_name: $scope.campaign.owner.camp_name,
                    camp_description: $scope.campaign.owner.camp_description,
                    camp_priority: $scope.campaign.owner.camp_priority,
                    camp_state: 'inactive',
                    sch_cd: $scope.campaign.owner.schedule
                }

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
                        RequestService.postJsonRequest('campaign/updateCampaign', campaignParams).then(function (updateCampaign) {
                            if (!updateCampaign.result) {
                                $scope.campaign.owner.camp_state = 'inactive';
                                sweet.show('Deactivated!', 'The campaign are not visible anymore', 'success');
                            } else {
                                sweet.show('Cancelled', '', 'error');
                            }
                        })

                    } else {
                        sweet.show('Cancelled', '', 'error');
                    }
                });
            }
        };

    }

    function redeemController($scope, BeaconService) {

        $scope.redeemers = [];
        $scope.beacons = [];


        var promise = BeaconService.getListOfBeacons();

        promise.then(function (r) {

            $scope.beacons = r.data


            if ($scope.campaign) {

                if ($scope.campaign.beacons) {

                    for (var i = 0; i < $scope.campaign.beacons.length; i++) {
                        if ($scope.campaign.beacons[i].config) {
                            console.log($scope.campaign.beacons[i])
                            if ($scope.campaign.beacons[i].config.interaction_type.lkp_name == "fetch") {
                                console.log($scope.campaign.beacons[i])
                                $scope.redeemers.push($scope.campaign.beacons[i]);
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

    function publishModalController($scope, $rootScope, $uibModal, RequestService) {

        $scope.associates = [];
        $scope.animationsEnabled = true;

        RequestService.postJsonRequest('company/findAssociates', {cmp_cd: $rootScope.company}).then(function (associates) {
            associates.forEach(function (associate) {
                if (associate.asc_state == 'accepted') {
                    if (associate.owner == $rootScope.company) {
                        $scope.associates.push(associate.asc_cmp_receiver_id);
                    } else {
                        $scope.associates.push(associate.asc_cmp_sender_id);
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
    function modalInstanceController($scope, $uibModalInstance, associates, campaign, beacon, RequestService) {
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

        $scope.saveBeaconConfig = function () {

            if ($scope.campaign.owner) {
                console.log($scope.campaign)
                if ($scope.beacon.camp_bcn_cd == undefined) {
                    console.log($scope.beacon)
                    var assignBeaconParams = {
                        camp_bcn_limit: $scope.beacon.camp_bcn_limit,
                        camp_bcn_state: true,
                        camp_bcn_start_age: $scope.beacon.camp_bcn_start_age,
                        camp_bcn_end_age: $scope.beacon.camp_bcn_end_age,
                        campaign: $scope.campaign.owner.camp_cd,
                        beacon: $scope.beacon.beacon.bcn_cd
                    }

                    RequestService.postJsonRequest('campaignBeacon/assignBeaconToCampaign', assignBeaconParams).then(function (assignBeaconResult) {


                        if ($scope.beacon.config.frequency) {

                            var beaconFrequencyConfiguration = {
                                camp_bcn_cd: assignBeaconResult.camp_bcn_cd,
                                lkp_cd: $scope.beacon.config.frequency.lkp_cd,
                                camp_bcn_value: $scope.beacon.config.frequency.value
                            }

                            RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconFrequencyConfiguration).then(function (frequencyConfig) {

                            })

                        }
                        if ($scope.beacon.config.interaction_type) {

                            var beaconInteractionTypeConfiguration = {
                                camp_bcn_cd: assignBeaconResult.camp_bcn_cd,
                                lkp_cd: $scope.beacon.config.interaction_type.lkp_cd
                            }

                            RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractionTypeConfiguration).then(function (interactionTypeConfig) {

                            })
                        }

                        if ($scope.beacon.config.interaction_with_gender) {

                            $scope.beacon.config.interaction_with_gender.forEach(function (gender) {
                                var beaconInteractWithGender = {
                                    camp_bcn_cd: assignBeaconResult.camp_bcn_cd,
                                    lkp_cd: gender.lkp_cd
                                }

                                RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractWithGender).then(function (interactWithGender) {

                                })
                            })


                        }

                        if ($scope.beacon.config.interaction_with_race) {
                            $scope.beacon.config.interaction_with_race.forEach(function (race) {
                                var beaconInteractWithRace = {
                                    camp_bcn_cd: assignBeaconResult.camp_bcn_cd,
                                    lkp_cd: race.lkp_cd
                                }

                                RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractWithRace).then(function (interactWithRace) {

                                })
                            })
                        }

                        if ($scope.beacon.config.trigger_type) {
                            var beaconTriggerType = {
                                camp_bcn_cd: assignBeaconResult.camp_bcn_cd,
                                lkp_cd: $scope.beacon.config.trigger_type.lkp_cd
                            }

                            RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconTriggerType).then(function (triggerType) {

                            })
                        }

                        $scope.beacon.bcn_used = true;

                    })

                } else {

                    RequestService.postJsonRequest('campaignLookup/findConfiguration', {camp_bcn_cd: $scope.beacon.camp_bcn_cd}).then(function (configurations) {


                        if (configurations.result) {

                            var updateBeaconParams = {
                                camp_bcn_cd: $scope.beacon.camp_bcn_cd,
                                camp_bcn_limit: $scope.beacon.camp_bcn_limit,
                                camp_bcn_state: true,
                                camp_bcn_start_age: $scope.beacon.camp_bcn_start_age,
                                camp_bcn_end_age: $scope.beacon.camp_bcn_end_age,
                                campaign: $scope.campaign.owner.camp_cd,
                                beacon: $scope.beacon.beacon.bcn_cd
                            }

                            RequestService.postJsonRequest('campaignBeacon/updateBeaconInCampaign', updateBeaconParams).then(function () {
                                if ($scope.beacon.config.frequency) {
                                    var beaconFrequencyConfiguration = {
                                        camp_bcn_cd: $scope.beacon.camp_bcn_cd,
                                        lkp_cd: $scope.beacon.config.frequency.lkp_cd,
                                        camp_bcn_value: $scope.beacon.config.frequency.value
                                    }

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconFrequencyConfiguration).then(function (frequencyConfig) {

                                    })
                                }
                                if ($scope.beacon.config.interaction_type) {

                                    var beaconInteractionTypeConfiguration = {
                                        camp_bcn_cd: $scope.beacon.camp_bcn_cd,
                                        lkp_cd: $scope.beacon.config.interaction_type.lkp_cd
                                    }

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractionTypeConfiguration).then(function (interactionTypeConfig) {

                                    })
                                }

                                if ($scope.beacon.config.interaction_with_gender) {

                                    $scope.beacon.config.interaction_with_gender.forEach(function (gender) {
                                        var beaconInteractWithGender = {
                                            camp_bcn_cd: $scope.beacon.camp_bcn_cd,
                                            lkp_cd: gender.lkp_cd
                                        }

                                        RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractWithGender).then(function (interactWithGender) {

                                        })
                                    })


                                }

                                if ($scope.beacon.config.interaction_with_race) {
                                    $scope.beacon.config.interaction_with_race.forEach(function (race) {
                                        var beaconInteractWithRace = {
                                            camp_bcn_cd: $scope.beacon.camp_bcn_cd,
                                            lkp_cd: race.lkp_cd
                                        }

                                        RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractWithRace).then(function (interactWithRace) {
                                            console.log(interactWithRace)
                                        })
                                    })
                                }

                                if ($scope.beacon.config.trigger_type) {
                                    var beaconTriggerType = {
                                        camp_bcn_cd: $scope.beacon.camp_bcn_cd,
                                        lkp_cd: $scope.beacon.config.trigger_type.lkp_cd
                                    }

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconTriggerType).then(function (triggerType) {
                                        console.log(triggerType)
                                    })
                                }
                            })


                        } else {


                            configurations.forEach(function (configuration) {

                                RequestService.postJsonRequest('campaignLookup/deleteConfiguration', {camp_lkp_cd: configuration.camp_lkp_cd}).then(function (result) {

                                })

                            })


                            var updateBeaconInCampaign = {
                                camp_bcn_limit: $scope.beacon.camp_bcn_limit,
                                camp_bcn_state: true,
                                camp_bcn_start_age: $scope.beacon.camp_bcn_start_age,
                                camp_bcn_end_age: $scope.beacon.camp_bcn_end_age,
                                campaign: $scope.campaign.owner.camp_cd,
                                beacon: $scope.beacon.beacon.bcn_cd,
                                camp_bcn_cd: $scope.beacon.camp_bcn_cd
                            }

                            RequestService.postJsonRequest('campaignBeacon/updateBeaconInCampaign', updateBeaconInCampaign).then(function (assignBeaconResult) {
                                console.log(assignBeaconResult);
                                console.log($scope.beacon)

                                if ($scope.beacon.config.frequency) {
                                    var beaconFrequencyConfiguration = {
                                        camp_bcn_cd: assignBeaconResult[0].camp_bcn_cd,
                                        lkp_cd: $scope.beacon.config.frequency.lkp_cd,
                                        camp_bcn_value: $scope.beacon.config.frequency.value
                                    }

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconFrequencyConfiguration).then(function (frequencyConfig) {
                                        console.log(frequencyConfig)
                                    })
                                }
                                if ($scope.beacon.config.interaction_type) {

                                    var beaconInteractionTypeConfiguration = {
                                        camp_bcn_cd: assignBeaconResult[0].camp_bcn_cd,
                                        lkp_cd: $scope.beacon.config.interaction_type.lkp_cd
                                    }

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractionTypeConfiguration).then(function (interactionTypeConfig) {
                                        console.log(interactionTypeConfig)
                                    })
                                }

                                if ($scope.beacon.config.interaction_with_gender) {

                                    $scope.beacon.config.interaction_with_gender.forEach(function (gender) {
                                        var beaconInteractWithGender = {
                                            camp_bcn_cd: assignBeaconResult[0].camp_bcn_cd,
                                            lkp_cd: gender.lkp_cd
                                        }

                                        RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractWithGender).then(function (interactWithGender) {
                                            console.log(interactWithGender)
                                        })
                                    })


                                }

                                if ($scope.beacon.config.interaction_with_race) {
                                    $scope.beacon.config.interaction_with_race.forEach(function (race) {
                                        var beaconInteractWithRace = {
                                            camp_bcn_cd: assignBeaconResult[0].camp_bcn_cd,
                                            lkp_cd: race.lkp_cd
                                        }

                                        RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractWithRace).then(function (interactWithRace) {
                                            console.log(interactWithRace)
                                        })
                                    })
                                }

                                if ($scope.beacon.config.trigger_type) {
                                    var beaconTriggerType = {
                                        camp_bcn_cd: assignBeaconResult[0].camp_bcn_cd,
                                        lkp_cd: $scope.beacon.config.trigger_type.lkp_cd
                                    }

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconTriggerType).then(function (triggerType) {
                                        console.log(triggerType)
                                    })
                                }


                            })
                        }


                    })


                }
            } else {
                alert('Please save your campaign first')


            }


            $uibModalInstance.close();
        }

        /**
         * cancel modal
         * @method cancel
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    function populateFrequencyController($scope, RequestService) {

        $scope.beaconTriggerType = [];
        $scope.beaconInteractWithGender = [];
        $scope.beaconInteractWithRace = [];
        $scope.beaconInteractionType = [];
        $scope.frequencies = [];

        RequestService.postJsonRequest('lookup/findLookup').then(function (lookups) {


            lookups.forEach(function (lookup) {

                if (lookup.lkp_category == "beacon_trigger_type") {
                    $scope.beaconTriggerType.push(lookup);
                } else if (lookup.lkp_category == "beacon_interact_with" && lookup.lkp_name == "gender") {
                    $scope.beaconInteractWithGender.push(lookup);
                } else if (lookup.lkp_category == "beacon_interact_with" && lookup.lkp_name == "race") {
                    $scope.beaconInteractWithRace.push(lookup);
                } else if (lookup.lkp_category == "frequency") {
                    $scope.frequencies.push(lookup);
                } else if (lookup.lkp_category == "beacon_interaction_type") {
                    $scope.beaconInteractionType.push(lookup);
                }
            })


        })


        // set the max and min value for input depending on the value chosen
        $scope.makeChanged = function () {


            if ($scope.beacon.config.frequency.lkp_name == "day") {
                $scope.min = 1;
                $scope.max = 6;
            } else if ($scope.beacon.config.frequency.lkp_name == "hour") {
                $scope.min = 1;
                $scope.max = 23;
            } else if ($scope.beacon.config.frequency.lkp_name == "week") {
                $scope.min = 1;
                $scope.max = 3;
            } else if ($scope.beacon.config.frequency.lkp_name == "month") {
                $scope.min = 1;
                $scope.max = 11;
            } else if ($scope.beacon.config.frequency.lkp_name == "year") {
                $scope.min = 1;
                $scope.max = 1;
            } else {
                $scope.min = 0;
                $scope.max = 0;
            }

        }

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

})
();
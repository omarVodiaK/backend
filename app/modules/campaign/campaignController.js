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
        .controller('PublishCampaignInstanceCtrl', publishCampaignModalController)
        .controller('ModalCampaignCtrl', modalController)
        .controller('ModalCampaignInstanceCtrl', modalInstanceController)
        .controller('CampaignStepCtrl', campaignStepController)
        .controller('CampaignAlertCtrl', alertController)
        .controller('PopulateFrequencyCtrl', populateFrequencyController)
        .controller('CampaignBadgeCtrl', campaignBadgeController)
        .controller('UpdateCampaignCtrl', updateCampaignController)
        //.controller('RedeemCtrl', redeemController)
        .controller('CampaignBadgeCtrl', campaignBadgeController)
        .controller('BeaconContentCtrl', beaconContentController)

    /**
     * @description load campaign data, delete and update campaign
     * @method campaignController
     * @param {object} $scope
     * @param {service} ShareData
     * @param {service} RequestService
     * @param {service} RefreshCampaign
     * @param {object} notify
     */
    function campaignController($scope, ShareData, RequestService, RefreshCampaign, notify) {

        RefreshCampaign.refreshCampaign().then(function (result) {
            if (result.result == "this model doesn't exist" || result.result == 'error') {

                notify({
                    message: "You have 0 campaign!",
                    classes: 'alert-info',
                    position: 'center',
                    duration: 2000
                });
            } else if (result.result == undefined) {
                $scope.campaigns = result;
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
        };

        $scope.removeCampaignRow = function (campaign) {

            if (campaign.trueOwner.cmp_camp_owner == true) {
                if (campaign.beacons != undefined) {
                    campaign.beacons.forEach(function (beacon) {
                        if (beacon.bcn_used == true) {
                            if (beacon.config.interaction_type.lkp_name == 'generate') {
                                RequestService.postJsonRequest('campaignLookup/deleteAllBeaconConfiguration', {camp_bcn_cd: beacon.camp_bcn_cd}).then(function (deleteBeaconConfigResult) {
                                    if (deleteBeaconConfigResult.result == 'deleted successfully') {
                                        RequestService.postJsonRequest('campaignBeacon/deleteBeaconFromCampaign', {camp_bcn_cd: beacon.camp_bcn_cd}).then(function (deleteBeaconResult) {
                                            if (deleteBeaconResult.result == 'deleted successfully') {

                                            }
                                        })
                                    }
                                })
                            } else if (beacon.config.interaction_type.lkp_name == 'fetch') {
                                RequestService.postJsonRequest('campaignLookup/deleteAllBeaconConfiguration', {camp_bcn_cd: beacon.camp_bcn_cd}).then(function (deleteBeaconConfigResult) {
                                    if (deleteBeaconConfigResult.result == 'deleted successfully') {
                                        RequestService.postJsonRequest('campaignBeacon/deleteBeaconFromCampaign', {camp_bcn_cd: beacon.camp_bcn_cd}).then(function (deleteBeaconResult) {
                                            if (deleteBeaconResult.result == 'deleted successfully') {

                                            }
                                        })
                                    }
                                })
                            } else if (beacon.config.interaction_type.lkp_name == 'push') {
                                if (beacon.contents.length > 0) {
                                    beacon.contents.forEach(function (content) {
                                        if (content.camp_bcn_cnt_cd != undefined) {
                                            RequestService.postJsonRequest('campaignContentLookup/deleteAllConfiguration', {camp_bcn_cnt_cd: content.camp_bcn_cnt_cd}).then(function (deleteConfigResult) {
                                                if (deleteConfigResult.result == "deleted successfully") {

                                                    RequestService.postJsonRequest('campaignContent/deleteBeaconFromCampaign', {camp_bcn_cnt_cd: content.camp_bcn_cnt_cd}).then(function (deleteContentResult) {
                                                        if (deleteContentResult.result == "deleted successfully") {
                                                            $scope.content = '';
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            }

                            RequestService.postJsonRequest('campaignLookup/deleteAllBeaconConfiguration', {camp_bcn_cd: beacon.camp_bcn_cd}).then(function (deleteBeaconConfigResult) {
                                if (deleteBeaconConfigResult.result == 'deleted successfully') {

                                    RequestService.postJsonRequest('campaignBeacon/deleteBeaconFromCampaign', {camp_bcn_cd: beacon.camp_bcn_cd}).then(function (deleteBeaconResult) {
                                        if (deleteBeaconResult.result == 'deleted successfully') {

                                            RequestService.postJsonRequest('companyCampaign/deleteAllCompaniesCampaign', {camp_cd: campaign.owner.camp_cd}).then(function (deleteCompaniesCampaign) {
                                                if (deleteCompaniesCampaign.result == 'deleted successfully') {

                                                    RequestService.postJsonRequest('scheduleDay/deleteAllScheduleDay', {sch_cd: campaign.sch_cd}).then(function (deleteScheduleDays) {
                                                        if (deleteScheduleDays.result == 'deleted successfully') {

                                                            RequestService.postJsonRequest('schedule/deleteSchedule', {sch_cd: campaign.sch_cd}).then(function (deleteSchedule) {
                                                                if (deleteSchedule.result == 'deleted successfully') {

                                                                    RequestService.postJsonRequest('campaign/deleteCampaign', {camp_cd: campaign.owner.camp_cd}).then(function (deleteCampaign) {
                                                                        if (deleteCampaign.result == 'deleted successfully') {
                                                                            notify({
                                                                                message: "Deleted Successfully!",
                                                                                classes: 'alert-success',
                                                                                position: 'center',
                                                                                duration: 2000
                                                                            });
                                                                            removeRow($scope.campaigns, campaign, $scope);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    RequestService.postJsonRequest('companyCampaign/deleteAllCompaniesCampaign', {camp_cd: campaign.owner.camp_cd}).then(function (deleteCompaniesCampaign) {
                        if (deleteCompaniesCampaign.result == 'deleted successfully') {

                            RequestService.postJsonRequest('scheduleDay/deleteAllScheduleDay', {sch_cd: campaign.sch_cd}).then(function (deleteScheduleDays) {
                                if (deleteScheduleDays.result == 'deleted successfully') {

                                    RequestService.postJsonRequest('schedule/deleteSchedule', {sch_cd: campaign.sch_cd}).then(function (deleteSchedule) {
                                        if (deleteSchedule.result == 'deleted successfully') {

                                            RequestService.postJsonRequest('campaign/deleteCampaign', {camp_cd: campaign.owner.camp_cd}).then(function (deleteCampaign) {
                                                if (deleteCampaign.result == 'deleted successfully') {
                                                    notify({
                                                        message: "Deleted Successfully!",
                                                        classes: 'alert-success',
                                                        position: 'center',
                                                        duration: 2000
                                                    });

                                                    removeRow($scope.campaigns, campaign, $scope);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else {
                RequestService.postJsonRequest('companyCampaign/deleteCampaignOwner', {cmp_camp_cd: campaign.trueOwner.cmp_camp_cd}).then(function (deleteCampaignOwner) {
                    if (deleteCampaignOwner.result == 'deleted successfully') {
                        notify({
                            message: "Deleted Successfully!",
                            classes: 'alert-success',
                            position: 'center',
                            duration: 2000
                        });

                        removeRow($scope.campaigns, campaign, $scope);
                    } else {
                        notify({message: 'Something gone wrong!', classes: 'alert-danger', position: 'center'});
                    }
                });
            }
        };

        $scope.updateCampaign = function (campaign, update) {
            campaign.update = update;
            // save
            ShareData.addData(campaign);
            window.location.href = "#/dashboard/new-campaign";
        };

    }

    /**
     * @description The controller include a function to check if the content is included in the campaign, populate content with his configurations and delete configuration
     * @method beaconContentController
     * @param {object} $scope
     * @param {service} RequestService
     * @param {object} notify
     */
    function beaconContentController($scope, RequestService, notify) {

        $scope.content = '';
        $scope.contents = [];

        // Check if content exists in the campaign
        $scope.checkContent = function (content) {

            if ($scope.contents.indexOf(content) == -1) {
                content.content = content;
                $scope.contents.push(content);
            } else {
                $scope.contents.splice($scope.contents.indexOf(content));
            }
        };

        $scope.openConfig = function (content) {
            $scope.content = content;
        };

        // delete configuration
        $scope.deleteConfig = function (beacon, campaign, content) {
            $scope.content = content;
            if (content != undefined && campaign != undefined && beacon != undefined) {

                if (content.camp_bcn_cnt_cd != undefined) {

                    RequestService.postJsonRequest('campaignContentLookup/deleteAllConfiguration', {camp_bcn_cnt_cd: content.camp_bcn_cnt_cd}).then(function (deleteConfigResult) {
                        if (deleteConfigResult.result == "deleted successfully") {

                            RequestService.postJsonRequest('campaignContent/deleteBeaconFromCampaign', {camp_bcn_cnt_cd: content.camp_bcn_cnt_cd}).then(function (deleteContentResult) {

                                if (deleteContentResult.result == "deleted successfully") {

                                    notify({
                                        message: 'Deleted Successfully!',
                                        classes: 'alert-success',
                                        position: 'center'
                                    });

                                    $scope.content = '';
                                }

                            });
                        }
                    });
                }
            }
        };
    }

    /**
     * @description
     * @method updateCampaignController
     * @param {object} $scope
     * @param {service} ShareData
     * @param {service} RequestService
     * @param {object} session
     * @param {service} RefreshCampaign
     * @param {object} notify
     */
    function updateCampaignController($scope, ShareData, RequestService, session, RefreshCampaign, notify) {

        // get Campaign Data
        var campaign = ShareData.getData();

        if (campaign[0] !== undefined) {

            $scope.campaign = campaign[0];

        } else {

            $scope.contents = [];
            $scope.contentTypes = [];

            RequestService.postJsonRequest('campaign/findCampaignBeacons', {'cmp_cd': session.getUser().user.cmp_cd}).then(function (beacons) {

                $scope.campaign = {};
                $scope.campaign.beacons = beacons;
                $scope.campaign.beacons = cleanup($scope.campaign.beacons, 'beacon');

                RequestService.postJsonRequest('content/findContentByCompanyId', {"cmp_cd": session.getUser().user.cmp_cd}).then(function (data) {

                    if (data.result == undefined) {

                        data.forEach(function (content) {
                            if (content.cnt_type.lkp_value != 'voucher') {
                                $scope.contents.push(content);
                            }
                        });

                        $scope.campaign.beacons.forEach(function (beacon) {
                            beacon.contents = $scope.contents;
                        });
                    }
                });
            });
        }

        // clear Campaign Data
        ShareData.clearData();

        // display correct title in the html page
        if ($scope.campaign == undefined) {
            $scope.title = 'new Campaign';

        } else {

            if ($scope.campaign.update == true) {

                $scope.title = 'update Campaign';

            } else {
                $scope.title = 'Campaign Details';
            }
        }

        $scope.day = [];
        $scope.selectedDays = [];

        $scope.selectedDay = function (id) {
            var selected = false;

            $scope.selectedDays.forEach(function (day) {
                if (day == id) {
                    selected = true;
                    $scope.selectedDays.splice($scope.selectedDays.indexOf(day), 1);
                }
            });

            if (selected == false) {

                $scope.selectedDays.push(id);
            }
        };

        // watch change on uib-timepicker for time begin
        $scope.timeBeginChanged = function (value) {
            $scope.timeBegin = value;
        };

        // watch change on uib-timepicker for time end
        $scope.timeEndChanged = function (value) {
            $scope.timeEnd = value;
        };

        ////////////////// begin timerpicker controller ///////////////////////////////

        // AM, PM choice the format is 12, by setting to false the format will be 24
        $scope.ismeridian = true;
        // set hour steps
        $scope.hstep = 1;
        // set minute steps
        $scope.mstep = 1;

        if ($scope.campaign == undefined) {

            //set default values for uib-timepicker(current time)
            $scope.timeBegin = new Date();
            $scope.timeEnd = new Date();

        } else {

            var timeBegin = new Date($scope.campaign.sch_date_start);
            var timeEnd = new Date($scope.campaign.sch_date_end);

            if ($scope.campaign.sch_time_end.slice(0, 2).indexOf(':') != -1) {

                var hours = '0' + $scope.campaign.sch_time_end.slice(0, 1);
                timeEnd.setHours(hours);
                timeEnd.setMinutes($scope.campaign.sch_time_end.slice(3));
                $scope.timeEnd = timeEnd;

            } else {

                timeEnd.setHours($scope.campaign.sch_time_end.slice(0, 2));
                timeEnd.setMinutes($scope.campaign.sch_time_end.slice(3));
                $scope.timeEnd = timeEnd;

            }

            if ($scope.campaign.sch_time_start.slice(0, 2).indexOf(':') != -1) {

                var hours = '0' + $scope.campaign.sch_time_start.slice(0, 1);
                timeBegin.setHours(hours);
                timeBegin.setMinutes($scope.campaign.sch_time_start.slice(3));
                $scope.timeBegin = timeBegin;

            } else {

                timeBegin.setHours($scope.campaign.sch_time_start.slice(0, 2));
                timeBegin.setMinutes($scope.campaign.sch_time_start.slice(3));
                $scope.timeBegin = timeBegin;

            }

            $scope.timeBegin = timeBegin;
            $scope.timeEnd = timeEnd;
        }

        //////////////////  end timerpicker controller ////////////////////////////////

        $scope.save = function () {

            if ($scope.campaign.owner == undefined || $scope.campaign.owner.camp_cd == undefined) {

                if (angular.element('#campaign_name').val() != '' && angular.element('#campaign_description').val() != '' && angular.element('#campaign_priority').val() != '') {

                    var campaignParams = {
                        camp_name: angular.element('#campaign_name').val(),
                        camp_description: angular.element('#campaign_description').val(),
                        camp_priority: angular.element('#campaign_priority').val(),
                        camp_state: 'inactive'
                    };

                    RequestService.postJsonRequest('campaign/createCampaign', campaignParams).then(function (createdCampaign) {

                        var companyCampaignParams = {
                            cmp_cd: session.getUser().user.cmp_cd,
                            camp_cd: createdCampaign.camp_cd,
                            camp_state: 'accepted',
                            cmp_camp_owner: true
                        };

                        RequestService.postJsonRequest('companyCampaign/createCampaignOwner', companyCampaignParams).then(function (result) {

                            var scheduleParams = {
                                sch_date_start: $scope.dtStart,
                                sch_date_end: $scope.dtEnd,
                                sch_time_start: $scope.timeBegin.getHours() + ':' + $scope.timeBegin.getMinutes(),
                                sch_time_end: $scope.timeEnd.getHours() + ':' + $scope.timeEnd.getMinutes(),
                                camp_cd: createdCampaign.camp_cd
                            };

                            RequestService.postJsonRequest('schedule/createSchedule', scheduleParams).then(function (schedule) {

                                var campaignNewParams = {
                                    camp_cd: createdCampaign.camp_cd,
                                    camp_name: angular.element('#campaign_name').val(),
                                    camp_description: angular.element('#campaign_description').val(),
                                    camp_priority: angular.element('#campaign_priority').val(),
                                    camp_state: 'inactive',
                                    sch_cd: schedule.sch_cd

                                };

                                $scope.selectedDays.forEach(function (day) {

                                    RequestService.postJsonRequest('scheduleDay/createScheduleDay', {
                                        day_cd: day,
                                        sch_cd: schedule.sch_cd
                                    }).then(function (res) {

                                    });

                                });

                                RequestService.postJsonRequest('campaign/updateCampaign', campaignNewParams).then(function (updatedCampaign) {

                                    notify({
                                        message: 'Campaign Created Successfully!',
                                        classes: 'alert-success',
                                        position: 'center'
                                    });

                                    RefreshCampaign.refreshCampaign().then(function (result) {

                                        if (result.result == "this model doesn't exist" || result.result == 'error') {

                                            notify({
                                                message: "You have 0 campaign!",
                                                classes: 'alert-info',
                                                position: 'center',
                                                duration: 2000
                                            });

                                        } else if (result.result == undefined) {

                                            result.forEach(function (camp) {

                                                if (camp.owner.camp_cd == createdCampaign.camp_cd) {

                                                    $scope.campaign = camp;

                                                    if ($scope.campaign) {

                                                        RequestService.postJsonRequest('campaign/findCampaignBeacons', {'cmp_cd': session.getUser().user.cmp_cd}).then(function (beacons) {

                                                            if ($scope.campaign.beacons) {

                                                                $scope.campaign.beacons.forEach(function () {

                                                                    beacons.forEach(function (beacon) {
                                                                        $scope.campaign.beacons.push(beacon);
                                                                    });

                                                                });

                                                                $scope.campaign.beacons = cleanup($scope.campaign.beacons, 'beacon');

                                                            } else {

                                                                $scope.campaign.beacons = beacons;
                                                                $scope.campaign.beacons = cleanup($scope.campaign.beacons, 'beacon');

                                                            }
                                                        });

                                                    }

                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    });

                } else {

                    notify({
                        message: "All information are required!",
                        classes: 'alert-info',
                        position: 'center',
                        duration: 2000
                    });

                }

            } else {

                var campaignParams = {
                    camp_cd: $scope.campaign.owner.camp_cd,
                    camp_name: angular.element('#campaign_name').val(),
                    camp_description: angular.element('#campaign_description').val(),
                    camp_priority: angular.element('#campaign_priority').val(),
                    camp_state: 'inactive',
                    sch_cd: $scope.campaign.sch_cd

                };

                RequestService.postJsonRequest('campaign/updateCampaign', campaignParams).then(function (updatedCampaign) {

                    if (!updatedCampaign.result) {
                        var scheduleParams = {
                            sch_cd: $scope.campaign.sch_cd,
                            sch_date_start: $scope.dtStart,
                            sch_date_end: $scope.dtEnd,
                            sch_time_start: $scope.timeBegin.getHours() + ':' + $scope.timeBegin.getMinutes(),
                            sch_time_end: $scope.timeEnd.getHours() + ':' + $scope.timeEnd.getMinutes(),
                            camp_cd: $scope.campaign.owner.camp_cd

                        };

                        RequestService.postJsonRequest('schedule/updateSchedule', scheduleParams).then(function (updatedSchedule) {

                            if (!updatedSchedule.result) {

                                RequestService.postJsonRequest('scheduleDay/deleteAllScheduleDay', {sch_cd: updatedSchedule[0].sch_cd}).then(function (deleteSchedule) {

                                    if (deleteSchedule.result == 'deleted successfully') {

                                        $scope.selectedDays.forEach(function (day) {

                                            RequestService.postJsonRequest('scheduleDay/createScheduleDay', {
                                                day_cd: day,
                                                sch_cd: updatedSchedule[0].sch_cd
                                            }).then(function (res) {
                                                if (res.result == undefined) {
                                                    notify({
                                                        message: "Updated Successfully!",
                                                        classes: 'alert-success',
                                                        position: 'center',
                                                        duration: 2000
                                                    });
                                                }
                                            });
                                        });

                                    } else {


                                        $scope.selectedDays.forEach(function (day) {

                                            RequestService.postJsonRequest('scheduleDay/createScheduleDay', {
                                                day_cd: day,
                                                sch_cd: updatedSchedule[0].sch_cd
                                            }).then(function (res) {
                                                notify({
                                                    message: "Updated Successfully!",
                                                    classes: 'alert-success',
                                                    position: 'center',
                                                    duration: 2000
                                                });
                                            });
                                        });
                                    }
                                });

                            } else {

                                notify({
                                    message: 'Could not update schedule!',
                                    classes: 'alert-danger',
                                    position: 'center'
                                });
                            }
                        });

                    } else {

                        notify({
                            message: 'Something gone wrong!',
                            classes: 'alert-danger',
                            position: 'center'
                        });
                    }
                });
            }
        };

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
            });

            $scope.days = {
                day: $scope.day
            };
        }

        ///////////////// end datepicker controller   //////////////////////////////////

    }

    /**
     * @description Select the content / content types / zone and navigate to from steps
     * @method campaignStepController
     * @param {object} $scope
     * @param {service} RequestService
     * @param {object} session
     */
    function campaignStepController($scope, RequestService, session) {

        $scope.step = 1;
        $scope.zones = [];
        $scope.contentTypes = [];
        $scope.contents = [];

        if ($scope.campaign) {

            RequestService.postJsonRequest('campaign/findCampaignBeacons', {'cmp_cd': session.getUser().user.cmp_cd}).then(function (beacons) {

                if ($scope.campaign.beacons) {

                    $scope.campaign.beacons.forEach(function (campBeacon) {

                        beacons.forEach(function (beacon) {
                            $scope.campaign.beacons.push(beacon);
                        });

                    });

                    $scope.campaign.beacons = cleanup($scope.campaign.beacons, 'beacon');

                } else {

                    $scope.campaign.beacons = beacons;
                    $scope.campaign.beacons = cleanup($scope.campaign.beacons, 'beacon');
                }

            });

        } else {

            $scope.campaign = [];

            RequestService.postJsonRequest('campaign/findCampaignBeacons', {'cmp_cd': session.getUser().user.cmp_cd}).then(function (beacons) {
                $scope.campaign.beacons = beacons;
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

    }

    /**
     * @description alert when activating/deactivate campaigns
     * @method alertController
     * @param {object} $scope
     * @param {object} sweet hSweetAlert dependencies
     * @param {service} RequestService
     */
    function alertController($scope, sweet, RequestService) {

        $scope.confirmCancel = function (campaign) {

            $scope.campaign = campaign;

            if ($scope.campaign.trueOwner.cmp_camp_owner == true) {

                if ($scope.campaign.owner.camp_state == 'inactive' || $scope.campaign.owner.camp_state == 'expired') {

                    var campaignParams = {
                        camp_cd: $scope.campaign.owner.camp_cd,
                        camp_name: $scope.campaign.owner.camp_name,
                        camp_description: $scope.campaign.owner.camp_description,
                        camp_priority: $scope.campaign.owner.camp_priority,
                        camp_state: 'active',
                        sch_cd: $scope.campaign.owner.schedule
                    };

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
                            });

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
                    };

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
                            });

                        } else {
                            sweet.show('Cancelled', '', 'error');
                        }
                    });
                }

            } else {

                if ($scope.campaign.trueOwner.camp_state == 'pending') {
                    var campaignParams = {
                        cmp_camp_cd: $scope.campaign.trueOwner.cmp_camp_cd,
                        camp_state: 'accepted'
                    };

                    sweet.show({
                        title: 'activate shared campaign',
                        text: 'Activate this campaign?',
                        type: 'info',
                        showCancelButton: true,
                        confirmButtonColor: '#03A9F4',
                        confirmButtonText: 'Yes, activate it!',
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function (isConfirm) {
                        if (isConfirm) {
                            RequestService.postJsonRequest('companyCampaign/UpdateState', campaignParams).then(function (updateCampaign) {
                                if (!updateCampaign.result) {
                                    $scope.campaign.trueOwner.camp_state = 'accepted';
                                    sweet.show('Activated!', 'The campaign is currently used.', 'success');
                                } else {
                                    sweet.show('Cancelled', '', 'error');
                                }
                            });

                        } else {
                            sweet.show('Cancelled', '', 'error');
                        }
                    });
                } else if ($scope.campaign.trueOwner.camp_state == 'accepted') {

                    var campaignParams = {
                        cmp_camp_cd: $scope.campaign.trueOwner.cmp_camp_cd,
                        camp_state: 'pending'
                    };

                    sweet.show({
                        title: 'Confirm',
                        text: 'Deactivate shared campaign?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#D32F2F',
                        confirmButtonText: 'Yes, Deactivate it!',
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function (isConfirm) {
                        if (isConfirm) {
                            RequestService.postJsonRequest('companyCampaign/UpdateState', campaignParams).then(function (updateCampaign) {
                                if (!updateCampaign.result) {
                                    $scope.campaign.trueOwner.camp_state = 'pending';
                                    sweet.show('Deactivated!', 'The campaign are not visible anymore', 'success');
                                } else {
                                    sweet.show('Cancelled', '', 'error');
                                }
                            });

                        } else {
                            sweet.show('Cancelled', '', 'error');
                        }
                    });
                }

            }
        };
    }

    /**
     * @description retrieve list of beacon configured to redeem
     * @method redeemController
     * @param {object} $scope
     * @param {service} BeaconService
     */
    //function redeemController($scope, BeaconService) {
    //
    //    $scope.redeemers = [];
    //    $scope.beacons = [];
    //
    //    var promise = BeaconService.getListOfBeacons();
    //
    //    promise.then(function (r) {
    //
    //        $scope.beacons = r.data;
    //
    //        if ($scope.campaign) {
    //
    //            if ($scope.campaign.beacons) {
    //
    //                for (var i = 0; i < $scope.campaign.beacons.length; i++) {
    //                    if ($scope.campaign.beacons[i].config) {
    //
    //                        if ($scope.campaign.beacons[i].config.interaction_type.lkp_name == "fetch") {
    //
    //                            $scope.redeemers.push($scope.campaign.beacons[i]);
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    });
    //}

    function modalController($scope, $uibModal) {
        $scope.animationsEnabled = true;

        /**
         * open modal
         * @method open
         * @param {string} size size of modal, leave empty for default size
         * @param {string} tpl name of the template
         * @param {object} beacon
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

    /**
     * @description find associates who are able to accept publishing request
     * @method publishModalController
     * @param {object} $scope
     * @param {object} session
     * @param {object} $uibModal
     * @param {service} DetailedAssociateService
     */
    function publishModalController($scope, session, $uibModal, DetailedAssociateService) {

        $scope.associates = [];
        $scope.animationsEnabled = true;

        DetailedAssociateService.getAssociates().then(function (associates) {

            if (!associates.result) {
                associates.forEach(function (associate) {
                    if (associate.asc_state == 'accepted') {
                        if (associate.owner == session.getUser().user.cmp_cd) {
                            $scope.associates.push(associate.asc_cmp_receiver_id);
                        } else {
                            $scope.associates.push(associate.asc_cmp_sender_id);
                        }
                    }
                });
            }

        });

        /**
         * open modal while providing a model that will be displayed on the respective form
         * @method openModal
         * @param {string} size size of modal, leave empty for default size
         * @param {string} tpl name of the template
         * @param {array} associates
         * @param {object} campaign
         */
        $scope.openModal = function (size, tpl, associates, campaign) {
            $scope.associates = associates;

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: tpl,
                controller: 'PublishCampaignInstanceCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    associates: function () {
                        return $scope.associates;
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
     * @description events for buttons inside publish campaign modal
     * @method publishCampaignModalController
     * @param {object} $scope
     * @param {object} $uibModalInstance
     * @param {object} campaign
     * @param {array} associates
     */
    function publishCampaignModalController($scope, $uibModalInstance, campaign, associates) {

        $scope.associates = associates;
        $scope.campaign = campaign;

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
     * @description configuration modal controller (load youtube thumbnail, save content configuration, save beacon configuration)
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $uibModalInstance
     * @param {array} associates
     * @param {object} campaign
     * @param {object} beacon
     * @param {service} RequestService
     * @param {object} notify
     */
    function modalInstanceController($scope, $uibModalInstance, associates, campaign, beacon, RequestService, notify) {

        $scope.associates = associates;
        $scope.campaign = campaign;
        $scope.beacon = beacon;

        /**
         * @description retrieve thumbnail from youtube video url
         * @method youtubeThumb
         * @param {string} url
         * @return {string} youtube video thumbnail
         * */
        $scope.youtubeThumb = function (url) {
            var video, results;

            if (url === null) {
                return '';
            }

            results = url.match('[\\?&]v=([^&#]*)');
            video = (results === null) ? url : results[1];

            return 'http://img.youtube.com/vi/' + video + '/0.jpg';
        };

        $scope.saveContentConfig = function (contents) {

            if (beacon.contents.length > 0) {
                beacon.contents.forEach(function (content) {

                    if (content.camp_bcn_cnt_cd != undefined && content.config != undefined) {

                        RequestService.postJsonRequest('campaignContentLookup/deleteAllConfiguration', {camp_bcn_cnt_cd: content.camp_bcn_cnt_cd}).then(function (deletedConfiguration) {

                            if (deletedConfiguration.result == 'deleted successfully') {

                                if (content.config.frequency != undefined) {


                                    RequestService.postJsonRequest('campaignContentLookup/addConfiguration', {

                                        camp_bcn_cnt_cd: content.camp_bcn_cnt_cd,
                                        lkp_cd: content.config.frequency.lkp_cd,
                                        camp_bcn_cnt_value: content.config.frequency.value

                                    }).then(function (frequency) {

                                        if (frequency.result == undefined) {
                                            //console.log('frequency created')
                                        }
                                    });
                                }

                                if (content.config.trigger_type != undefined) {

                                    RequestService.postJsonRequest('campaignContentLookup/addConfiguration', {
                                        camp_bcn_cnt_cd: content.camp_bcn_cnt_cd,
                                        lkp_cd: content.config.trigger_type.lkp_cd
                                    }).then(function (frequency) {
                                        if (frequency.result == undefined) {
                                            //console.log('trigger type created')
                                        }
                                    });
                                }

                                if (content.config.interaction_with_gender.length > 0) {
                                    content.config.interaction_with_gender.forEach(function (genderInteraction) {

                                        RequestService.postJsonRequest('campaignContentLookup/addConfiguration', {
                                            camp_bcn_cnt_cd: content.camp_bcn_cnt_cd,
                                            lkp_cd: genderInteraction.lkp_cd

                                        }).then(function (frequency) {
                                            if (frequency.result == undefined) {
                                                //console.log('gender interaction created')
                                            }
                                        });
                                    });
                                }

                                if (content.config.interaction_with_race.length > 0) {

                                    content.config.interaction_with_race.forEach(function (raceInteraction) {

                                        RequestService.postJsonRequest('campaignContentLookup/addConfiguration', {
                                            camp_bcn_cnt_cd: content.camp_bcn_cnt_cd,
                                            lkp_cd: raceInteraction.lkp_cd

                                        }).then(function (frequency) {

                                            if (frequency.result == undefined) {
                                                //console.log('race interaction created')
                                            }

                                        });
                                    });
                                }
                            }
                        });
                    } else if (content.camp_bcn_cnt_cd == undefined && content.config != undefined) {

                        var assignContentToBeacon = {
                            camp_bcn_cnt_start_age: content.camp_bcn_cnt_start_age,
                            camp_bcn_cnt_end_age: content.camp_bcn_cnt_end_age,
                            camp_bcn_cnt_priority: content.camp_bcn_cnt_priority,
                            camp_bcn_cd: beacon.camp_bcn_cd,
                            cnt_cd: content.cnt_cd
                        };

                        RequestService.postJsonRequest('campaignContent/assignContentToBeacon', assignContentToBeacon).then(function (assignedContentToBeacon) {
                            //console.log(assignedContentToBeacon);

                            if (content.config.frequency != undefined) {


                                RequestService.postJsonRequest('campaignContentLookup/addConfiguration', {

                                    camp_bcn_cnt_cd: assignedContentToBeacon.camp_bcn_cnt_cd,
                                    lkp_cd: content.config.frequency.lkp_cd,
                                    camp_bcn_cnt_value: content.config.frequency.value

                                }).then(function (frequency) {

                                    if (frequency.result == undefined) {
                                        //console.log('frequency created')
                                    }
                                });
                            }

                            if (content.config.trigger_type != undefined) {

                                RequestService.postJsonRequest('campaignContentLookup/addConfiguration', {
                                    camp_bcn_cnt_cd: assignedContentToBeacon.camp_bcn_cnt_cd,
                                    lkp_cd: content.config.trigger_type.lkp_cd
                                }).then(function (frequency) {
                                    if (frequency.result == undefined) {
                                        //console.log('trigger type created')
                                    }
                                });
                            }

                            if (content.config.interaction_with_gender.length > 0) {
                                content.config.interaction_with_gender.forEach(function (genderInteraction) {

                                    RequestService.postJsonRequest('campaignContentLookup/addConfiguration', {
                                        camp_bcn_cnt_cd: assignedContentToBeacon.camp_bcn_cnt_cd,
                                        lkp_cd: genderInteraction.lkp_cd

                                    }).then(function (frequency) {
                                        if (frequency.result == undefined) {
                                            //console.log('gender interaction created')
                                        }
                                    });
                                });
                            }

                            if (content.config.interaction_with_race.length > 0) {

                                content.config.interaction_with_race.forEach(function (raceInteraction) {

                                    RequestService.postJsonRequest('campaignContentLookup/addConfiguration', {
                                        camp_bcn_cnt_cd: assignedContentToBeacon.camp_bcn_cnt_cd,
                                        lkp_cd: raceInteraction.lkp_cd

                                    }).then(function (frequency) {

                                        if (frequency.result == undefined) {
                                            //console.log('race interaction created')
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            } else {
                alert("something went wrong");
            }

            $uibModalInstance.close();
        };

        /**
         * press ok in modal
         * @method ok
         */
        $scope.ok = function () {

            $uibModalInstance.close();
        };

        $scope.saveBeaconConfig = function () {
            if ($scope.campaign.owner) {

                if ($scope.beacon.camp_bcn_cd == undefined) {
                    if ($scope.beacon.config == undefined || $scope.beacon.camp_bcn_limit == undefined) {

                        notify({
                            message: 'Please fill the required information',
                            classes: 'alert-warning',
                            position: 'center'
                        });

                    } else {
                        var assignBeaconParams = {
                            camp_bcn_limit: $scope.beacon.camp_bcn_limit,
                            camp_bcn_state: true,
                            camp_bcn_start_age: $scope.beacon.camp_bcn_start_age,
                            camp_bcn_end_age: $scope.beacon.camp_bcn_end_age,
                            campaign: $scope.campaign.owner.camp_cd,
                            beacon: $scope.beacon.beacon.bcn_cd
                        };

                        RequestService.postJsonRequest('campaignBeacon/assignBeaconToCampaign', assignBeaconParams).then(function (assignBeaconResult) {


                            if ($scope.beacon.config.frequency) {

                                var beaconFrequencyConfiguration = {
                                    camp_bcn_cd: assignBeaconResult.camp_bcn_cd,
                                    lkp_cd: $scope.beacon.config.frequency.lkp_cd,
                                    camp_bcn_value: $scope.beacon.config.frequency.value
                                };

                                RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconFrequencyConfiguration).then(function (frequencyConfig) {

                                });

                            }
                            if ($scope.beacon.config.interaction_type) {

                                var beaconInteractionTypeConfiguration = {
                                    camp_bcn_cd: assignBeaconResult.camp_bcn_cd,
                                    lkp_cd: $scope.beacon.config.interaction_type.lkp_cd
                                };

                                RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractionTypeConfiguration).then(function (interactionTypeConfig) {

                                });
                            }

                            if ($scope.beacon.config.interaction_with_gender) {

                                $scope.beacon.config.interaction_with_gender.forEach(function (gender) {
                                    var beaconInteractWithGender = {
                                        camp_bcn_cd: assignBeaconResult.camp_bcn_cd,
                                        lkp_cd: gender.lkp_cd
                                    };

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractWithGender).then(function (interactWithGender) {

                                    });
                                });
                            }

                            if ($scope.beacon.config.interaction_with_race) {
                                $scope.beacon.config.interaction_with_race.forEach(function (race) {
                                    var beaconInteractWithRace = {
                                        camp_bcn_cd: assignBeaconResult.camp_bcn_cd,
                                        lkp_cd: race.lkp_cd
                                    };

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractWithRace).then(function (interactWithRace) {

                                    });
                                });
                            }

                            if ($scope.beacon.config.trigger_type) {
                                var beaconTriggerType = {
                                    camp_bcn_cd: assignBeaconResult.camp_bcn_cd,
                                    lkp_cd: $scope.beacon.config.trigger_type.lkp_cd
                                };

                                RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconTriggerType).then(function (triggerType) {

                                });
                            }

                            $scope.beacon.bcn_used = true;

                        });
                        $uibModalInstance.close();
                    }

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
                            };

                            RequestService.postJsonRequest('campaignBeacon/updateBeaconInCampaign', updateBeaconParams).then(function () {

                                if ($scope.beacon.config.frequency) {
                                    var beaconFrequencyConfiguration = {
                                        camp_bcn_cd: $scope.beacon.camp_bcn_cd,
                                        lkp_cd: $scope.beacon.config.frequency.lkp_cd,
                                        camp_bcn_value: $scope.beacon.config.frequency.value
                                    };

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconFrequencyConfiguration).then(function (frequencyConfig) {

                                    });
                                }

                                if ($scope.beacon.config.interaction_type) {

                                    var beaconInteractionTypeConfiguration = {
                                        camp_bcn_cd: $scope.beacon.camp_bcn_cd,
                                        lkp_cd: $scope.beacon.config.interaction_type.lkp_cd
                                    };

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractionTypeConfiguration).then(function (interactionTypeConfig) {
                                    });
                                }

                                if ($scope.beacon.config.interaction_with_gender) {

                                    $scope.beacon.config.interaction_with_gender.forEach(function (gender) {
                                        var beaconInteractWithGender = {
                                            camp_bcn_cd: $scope.beacon.camp_bcn_cd,
                                            lkp_cd: gender.lkp_cd
                                        };

                                        RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractWithGender).then(function (interactWithGender) {
                                        });
                                    });
                                }

                                if ($scope.beacon.config.interaction_with_race) {

                                    $scope.beacon.config.interaction_with_race.forEach(function (race) {

                                        var beaconInteractWithRace = {
                                            camp_bcn_cd: $scope.beacon.camp_bcn_cd,
                                            lkp_cd: race.lkp_cd
                                        };

                                        RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractWithRace).then(function (interactWithRace) {
                                        });

                                    });

                                }

                                if ($scope.beacon.config.trigger_type) {
                                    var beaconTriggerType = {
                                        camp_bcn_cd: $scope.beacon.camp_bcn_cd,
                                        lkp_cd: $scope.beacon.config.trigger_type.lkp_cd
                                    };

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconTriggerType).then(function (triggerType) {
                                    });
                                }
                            });

                        } else {

                            configurations.forEach(function (configuration) {

                                RequestService.postJsonRequest('campaignLookup/deleteConfiguration', {camp_lkp_cd: configuration.camp_lkp_cd}).then(function (result) {
                                });
                            });

                            var updateBeaconInCampaign = {
                                camp_bcn_limit: $scope.beacon.camp_bcn_limit,
                                camp_bcn_state: true,
                                camp_bcn_start_age: $scope.beacon.camp_bcn_start_age,
                                camp_bcn_end_age: $scope.beacon.camp_bcn_end_age,
                                campaign: $scope.campaign.owner.camp_cd,
                                beacon: $scope.beacon.beacon.bcn_cd,
                                camp_bcn_cd: $scope.beacon.camp_bcn_cd
                            };

                            RequestService.postJsonRequest('campaignBeacon/updateBeaconInCampaign', updateBeaconInCampaign).then(function (assignBeaconResult) {


                                if ($scope.beacon.config.frequency) {

                                    var beaconFrequencyConfiguration = {
                                        camp_bcn_cd: assignBeaconResult[0].camp_bcn_cd,
                                        lkp_cd: $scope.beacon.config.frequency.lkp_cd,
                                        camp_bcn_value: $scope.beacon.config.frequency.value
                                    };

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconFrequencyConfiguration).then(function (frequencyConfig) {
                                    });

                                }

                                if ($scope.beacon.config.interaction_type) {

                                    var beaconInteractionTypeConfiguration = {
                                        camp_bcn_cd: assignBeaconResult[0].camp_bcn_cd,
                                        lkp_cd: $scope.beacon.config.interaction_type.lkp_cd
                                    };

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractionTypeConfiguration).then(function (interactionTypeConfig) {
                                    });
                                }

                                if ($scope.beacon.config.interaction_with_gender) {

                                    $scope.beacon.config.interaction_with_gender.forEach(function (gender) {
                                        var beaconInteractWithGender = {
                                            camp_bcn_cd: assignBeaconResult[0].camp_bcn_cd,
                                            lkp_cd: gender.lkp_cd
                                        };

                                        RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractWithGender).then(function (interactWithGender) {
                                        });
                                    });
                                }

                                if ($scope.beacon.config.interaction_with_race) {
                                    $scope.beacon.config.interaction_with_race.forEach(function (race) {
                                        var beaconInteractWithRace = {
                                            camp_bcn_cd: assignBeaconResult[0].camp_bcn_cd,
                                            lkp_cd: race.lkp_cd
                                        };

                                        RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconInteractWithRace).then(function (interactWithRace) {
                                        });
                                    });
                                }

                                if ($scope.beacon.config.trigger_type) {
                                    var beaconTriggerType = {
                                        camp_bcn_cd: assignBeaconResult[0].camp_bcn_cd,
                                        lkp_cd: $scope.beacon.config.trigger_type.lkp_cd
                                    };

                                    RequestService.postJsonRequest('campaignLookup/addConfiguration', beaconTriggerType).then(function (triggerType) {
                                    });
                                }
                            });
                        }
                    });
                    $uibModalInstance.close();
                }

            } else {

                notify({
                    message: 'Please save your campaign first!',
                    classes: 'alert-warning',
                    position: 'center'
                });
                $uibModalInstance.close();
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
     * @description populate beacon configurations (lookups)
     * @method populateFrequencyController
     * @param {object} $scope
     * @param {service} RequestService
     */
    function populateFrequencyController($scope, RequestService) {

        $scope.beaconTriggerType = [];
        $scope.beaconInteractWithGender = [];
        $scope.beaconInteractWithRace = [];
        $scope.beaconInteractionType = [];
        $scope.frequencies = [];

        // find beacon configurations (lookups)
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
            });

        });

        // set min and max value for frequency occurrence field depending on the chosen frequency
        $scope.makeContentChanged = function () {
            if ($scope.content.config.frequency.lkp_name == "day") {
                $scope.min = 1;
                $scope.max = 6;
            } else if ($scope.content.config.frequency.lkp_name == "hour") {
                $scope.min = 1;
                $scope.max = 23;
            } else if ($scope.content.config.frequency.lkp_name == "week") {
                $scope.min = 1;
                $scope.max = 3;
            } else if ($scope.content.config.frequency.lkp_name == "month") {
                $scope.min = 1;
                $scope.max = 11;
            } else if ($scope.content.config.frequency.lkp_name == "year") {
                $scope.min = 1;
                $scope.max = 1;
            } else {
                $scope.min = 0;
                $scope.max = 0;
            }
        };

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
     * @description Handles the notification part using toastr in the side and top bar of the dashboard.
     * @method campaignBadgeController
     * @param {object} $scope
     * @param {object} toastr
     * @param {object} session
     * @param {service} DetailedCampaign
     */
    function campaignBadgeController($scope, toastr, session, DetailedCampaign) {

        if (session.getUser() != null) {
            $scope.publishRequestNumber = 0;
            $scope.campaignNotification = [];

            DetailedCampaign.getCampaignByCompanyId().then(function (result) {
                if (result.result == "this model doesn't exist" || result.result == 'error') {

                }
                else if (result.result == undefined) {
                    result.forEach(function (campaignsList) {
                        if (campaignsList.trueOwner.cmp_camp_owner == false && campaignsList.trueOwner.camp_state == 'pending') {
                            $scope.campaignNotification.push(campaignsList);
                            $scope.publishRequestNumber++;
                        }
                    });
                }

                if ($scope.publishRequestNumber > 0) {

                    if ($scope.publishRequestNumber == 1) {

                        toastr.info('You have ' + $scope.publishRequestNumber + ' publish pending request', 'Information');
                    } else {
                        toastr.info('You have ' + $scope.publishRequestNumber + ' publish pending requests', 'Information');
                    }
                }
            });
        }
    }

    // merge json object
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
     * @description remove object from array
     * @method removeRow
     * @param {array} campaigns
     * @param {object} campaign
     * @param {object} $scope
     *
     * */
    function removeRow(campaigns, campaign, $scope) {
        var index = -1;
        var arrCampaigns = campaigns;
        for (var i = 0; i < arrCampaigns.length; i++) {
            if (arrCampaigns[i].id === campaign.id) {
                index = i;
                break;
            }
        }


        $scope.campaigns.splice(index, 1);
    }

})();